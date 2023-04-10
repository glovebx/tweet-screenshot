/**
 * Injects the pop-over interface allowing you to download the tweet as an image
 * 
 * TODO: 
 *  - allow hiding of certain elements
 *  - fix text alignment in certain posts
 *  - 
 * @author @AnotherBlacKid
 */
var TweetDownloaderInterface = {
    /**
     * The visibility state of the interface
     */
    hidden : true,
    /**
     * A reference to the tweet in question
     */
    tweet : null,
    /**
     * A reference to the generated image for re-cropping
     */
    tweetImage : null,
    /**
     * Twitter root_url
     */
    root_url : "https://twitter.com",
    /**
     * The url of the tweet
     */
    url : "",

    crop : {
        normal : [0, 0, 0, -2],
        noUserInfo : [30, 30, null, -2]
    },
    /**
     * The canvas that everything is drawn on
     */
    canvas : document.createElement('canvas'),
    /**
     * ctx
     */
    ctx : null,
    /**
     * The interface element displayed once the download as image button is clicked
     */
    element : (function(){
        var el = document.createElement('div');
        el.className = "Tweet-Downloader";
        el.innerHTML = "<div class='Tweet-Downloader-Inner'> <div class='Tweet-Downloader-Close'> X </div> <div class='Tweet-Downloader-Image-Container'></div><div class='Tweet-Downloader-Options'></div> </div>";
        el.addEventListener("click", function( e ){
            // if x button or background somewhere, toggle the modal again
            TweetDownloaderInterface.toggle();
        });
        return el;
    })(),
    /**
     * Draw the canvas onto another canvas
     * This can be used to crop the image before outputting it
     */
    draw : function( c, mode ){
        var crop = this.crop[mode || "normal"] || this.crop.normal;

        this.ctx = this.ctx || this.canvas.getContext('2d');
        this.canvas.width = c.width;
        this.canvas.height = c.height + crop[3]; 
        
        this.ctx.drawImage( c, 0, 0, c.width, c.height );

        var imgData = this.canvas.toDataURL();
        
        this.element.querySelector(".Tweet-Downloader-Image-Container").appendChild( this.canvas );
    },
    /**
     * Set the tweet then open the modal
     */
    setTweet : async function ( tweet ){
        // const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

        this.tweet = tweet;

        this.canvas.width = 0;
        this.canvas.height = 0;
        // var hidden = [];
        // // trim some unecessary stuff from the tweet by hiding it
        // for ( var i = 0; i < hidden.length; i++ ){
        //     hidden[i].style.display = none;
        // }

        let tweetId = "";
        const elTime = tweet.querySelector('time');
        if (elTime && elTime.parentElement.tagName === 'A') {
          const tweetUrl = elTime.parentElement.attributes['href'].value;
          const fragment = tweetUrl.split('/');
          tweetId = fragment[fragment.length - 1];
        }
        if (!tweetId) {
            tweetId = (new Date()).getTime().toString();
        }

        // Bring up the interface (assumed hidden)
        // this.url = this.root_url + tweet.getAttribute("data-permalink-path");
        // var that = this;

        const cropTarget = await CropTarget.fromElement(this.tweet);

        // Prompt user to share the tab's content.
        const stream = await navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true });
        const [track] = stream.getVideoTracks();
        
        // Start cropping the self-capture video track using the CropTarget <-- Magic!
        await track.cropTo(cropTarget);

        const canvas = await this.drawToCanvas(stream);

        track.stop();
        // const base64image = canvas.toDataURL("image/png");
        // window.location.href = base64image;
        // const that = this;
        canvas.toBlob((blob) => {
          // See https://web.dev/patterns/files/save-a-file/ to save this blob locally.
        //   console.log('canvas.toBlob');
          const blobUrl = URL.createObjectURL(blob);

        chrome.storage.sync.get('mode', function(data) {
            if (data.mode === 'save') {
                const a = document.createElement('a');
                a.setAttribute('download', tweetId + ".png");
                a.setAttribute('href', blobUrl);
                a.click();      
            } else if (data.mode === 'tab') {
                // window.location.href = blobUrl;
                chrome.runtime.sendMessage({ open_new_tab: true, url: blobUrl });
                // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                //     var tab = tabs[0];
                //     // console.log(tab.index);
                //     chrome.tabs.create({url: blobUrl, index: tab.index + 1});
                //   });                
            }      
        });        

        //   wait(1000);
        });

        // //translate html to canvas via html2canvas
        // html2canvas( this.tweet, 
        //     {
        //         useCORS: true,
        //         allowTaint : true,
        //         letterRendering : true,
        //         background : "#fff",
        //         onrendered : that.draw.bind(that)
        //     }
        // );

        // // unhide things that were hidden
        // for ( var i = 0; i < hidden.length; i++ ){
        //     hidden[i].style.display = '';
        // }

        // this.toggle();
    },
    /**
     * Display the interface if it's hidden
     * hide it if it's not
     */
    toggle : function () {
        this.hidden = !this.hidden;
        if ( this.hidden === false ) {
            document.body.prepend( this.element );
        }
        else {
            document.body.removeChild( this.element );
        }
    },

    drawToCanvas: async function(stream) {
        const canvas = document.createElement("canvas");
        const video = document.createElement("video");
        video.srcObject = stream;

        // Play it.
        await video.play();

        // Draw one video frame to canvas.
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        return canvas;
    }   
}
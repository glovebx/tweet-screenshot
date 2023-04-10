// var tweetId

// chrome.runtime.onMessage.addListener(gotMessage)

// function gotMessage(message) {
//     tweetId = message.txt
//     console.log(tweetId)
// }

// async function Buttoncreation(){
//     const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));
//     await wait(2000);

//     var replyList = document.querySelectorAll('div[data-testid="reply"]');
//     while (!replyList || replyList.length == 0) {
//         console.log("waiting......");
//         await wait(2000);
//         replyList = document.querySelectorAll('div[data-testid="reply"]');
//     }

//     console.log("modifyer started");
//     // Get the parent element
//     // var parent = document.querySelector('.css-1dbjc4n.r-1awozwy.r-6koalj.r-18u37iz');
//     document.querySelectorAll('div[data-testid="reply"]').forEach((reply) => {
//         var parent = reply.parentNode.parentNode;

//         // Create a new div element
//         var newDiv = document.createElement('div');

//         // Add the new div as the first child of the parent element
//         parent.append(newDiv);

//         // Create a button element
//         var button = document.createElement('button');

//         // Set button's text content
//         button.textContent = 'Analyse';

//         // Add button to the new div element
//         newDiv.appendChild(button);

//         // Add Event Listener
//         button.addEventListener('click', function() {
//             console.log("the TweetID:" + tweetId + "has been sent")
//         //TODO
//         });

//         // Give the elements a class
//         newDiv.className = 'my-div';
//         // button.id = 'my-button';
//     });

// }
// Buttoncreation()

(function(){
    var tweetId

    chrome.runtime.onMessage.addListener(gotMessage)
    
    function gotMessage(message) {
        tweetId = message.txt
        console.log(tweetId)
    }

    const TWEET_TEST_ID = 'tweet';
    const TWEET_SHARE_BUTTON_ARIA_LABEL = 'Share Tweet';
    // var tweet_class = "tweet";
    var share_button_class = "ProfileTweet-action--more";

    // var download_button = document.createElement("li");
    // download_button.class = "download-tweet"
    // download_button.innerHTML = "<button type=\"button\" class=\"dropdown-link\">Download As Image</button>";

    var download_button = document.createElement("div");
    download_button.role = "menuitem" ;
    download_button.tabindex = "0";
    download_button.className = "css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-ymttw5 r-1f1sjgu r-o7ynqc r-6416eg r-13qz1uu";
    download_button.innerHTML = "<div class='css-1dbjc4n r-1777fci r-j2kj52'><svg t='1679822147405' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='6389' width='24' height='24'><path d='M889.263158 781.473684h-107.789474v107.789474a26.947368 26.947368 0 0 1-53.894737 0v-107.789474H269.473684a26.947368 26.947368 0 0 1-26.947368-26.947368V296.421053H134.736842a26.947368 26.947368 0 1 1 0-53.894737h107.789474V134.736842a26.947368 26.947368 0 1 1 53.894737 0v107.789474h458.105263a26.947368 26.947368 0 0 1 26.947368 26.947368v458.105263h107.789474a26.947368 26.947368 0 0 1 0 53.894737z m-161.684211-485.052631H296.421053v431.157894h431.157894V296.421053z' fill='#010101' p-id='6390'></path></svg></div><div class='css-1dbjc4n r-16y2uox r-1wbh5a2'><div dir='ltr' class='css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0'><span class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0'>Download as Image</span></div></div>";


    /**
     * Obtains some information from the tweet and then passes said information to
     * the interface so that the interface can make a picture out of it
     * 
     * @param e - The event information obtained from the EventListener
     */
    function makeThatShit ( e ) {
        // rev up those friers 
        // this.tweetTarget.querySelector("."+share_button_class+" .dropdown").classList.remove("open");
        var dropDown_menu = document.querySelector('div[data-testid="Dropdown"]');
        if (dropDown_menu) {
            dropDown_menu.parentElement.parentElement.parentElement.style.display = 'none';
        }
        TweetDownloaderInterface.setTweet( this.tweetTarget );
        e.preventDefault();
        return false;
    }

    download_button.addEventListener( "click", makeThatShit );
    /** 
     * Dynamically add the download button as items are clicked in order
     *  to avoid the hastle of dealing with Twitter's AJAX and infinite scroll
     * @param e - The event information obtained from the EventListener
     */
    function dynamicButtonAddition ( e ) {        
        // const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));
        // await wait(2000);

        // var replyList = document.querySelectorAll('div[data-testid="' + TWEET_TEST_ID + '"]');
        // while (!replyList || replyList.length == 0) {
        //     console.log("waiting......");
        //     await wait(2000);
        //     replyList = document.querySelectorAll('div[data-testid="' + TWEET_TEST_ID + '"]');
        // }

        //console.log( e );
        var target = e.target;
        var clicked_dropdown = false;
        // target.parentNode.parentNode.parentNode.getAttribute('aria-label')
        // percolate upwards through DOM until we hit the tweet root or body element
        // while ( !target.classList.contains( tweet_class ) && target != document.body ){
        //     // Check if we actually clicked the menu button and not somewhere else on the tweet
        //     if ( target.classList.contains ( share_button_class ) ) 
        //         clicked_dropdown = true;

        //     target = target.parentElement;
        // }
        while ( target.getAttribute('data-testid') !== TWEET_TEST_ID && target != document.body ){
            // Check if we actually clicked the menu button and not somewhere else on the tweet
            // if (target.getAttribute('data-testid') === TWEET_TEST_ID) {
            //     clicked_dropdown = true;
            // }
            if (target.getAttribute('aria-label') === TWEET_SHARE_BUTTON_ARIA_LABEL) {
                clicked_dropdown = true;
            }

            target = target.parentElement;
        }        

        // if we make it to the body element then we've gone too far
        if ( !clicked_dropdown || target == document.body ) return;


        setTimeout(() => {
            var dropDown_menu = document.querySelector('div[data-testid="Dropdown"]');
            if (dropDown_menu) {
                // add the button to the dropdown menu
                dropDown_menu.prepend( download_button );
                // set the download button target
                download_button.tweetTarget = target;
            }
        }, 100);
        // // find the share button
        // var share_button = target.getElementsByClassName( share_button_class )[0];
        // // use the share button to find dropdown menu
        // var dropDown_menu = share_button.getElementsByTagName("ul")[0];
        // var dropDown_menu = document.querySelector('div[data-testid="Dropdown"]');
        // // add the button to the dropdown menu
        // dropDown_menu.prepend( download_button );
        // // set the download button target
        // download_button.tweetTarget = target;
    }
    // add listener to body
    document.body.addEventListener( "mousedown", dynamicButtonAddition );
})();
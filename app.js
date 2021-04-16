let bodyHtml = document.querySelector('body');
let topSection = document.querySelector('.top-section')
let secondSection = document.querySelector('.second-section')
let cardContent = document.querySelector('.card-content')
let easyGame = document.getElementById('24K');
let hardGame = document.getElementById('48K');
let subjectValue = document.querySelector('.subject-value');
let starrBtn = document.querySelector('.start-btn')
let warningMessage = document.querySelector('.warning-message')
let popUp = document.querySelector('.third-section')
let playAgain = document.querySelector('.playagain-btn');

let Gamesubject, GameLevel;


let choseLevelAndSubject = new Promise(function (resolve) {
    starrBtn.addEventListener('click', function (event) {
        event.preventDefault();
        Gamesubject = (subjectValue.value).trim();
        if (Gamesubject.length && (easyGame.checked || hardGame.checked)) {
            if (easyGame.checked) {
                GameLevel = easyGame.value; /* Original value  : easyGame.value */ 
                /* Change valu här om du vill ha mindre kort for easy */
            }
            if (hardGame.checked) {
                    GameLevel = hardGame.value;  /* Original value  : hardGame.value */ 
                    /* Change valu här om du vill ha mindre kort for hard */
            }
            subjectValue.value = ''
            warningMessage.style.display = 'none';
            resolve();
        }
        else { warningMessage.style.display = 'block' };
    }
    )
})


async function startTheGame() {
    await choseLevelAndSubject;
    topSection.style.visibility = "hidden";
    topSection.style.Width = "0";
    topSection.style.height = "0";
    secondSection.style.visibility = "visible";
}



let arrayPhoto = [];

let bildUrlforApi = async function () {

    let url;
    await startTheGame()

    let searchWord = Gamesubject;
    let apiKey = '9588ff16cc05d4e98bcb23ab4b518b05'
    url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${searchWord}&sort=relevance&safe_search=1&per_page=500&format=json&nojsoncallback=1
 `;
    let fetchLink = fetch(url).then(function (responsiv) {
        return responsiv.json(url);
    });
    let fetchData = await fetchLink.then(function (data) {

        for (let i = 0; i <= 498; i++) {/*  498 - 8 yes*/
            let photosData = function () {
                this.PhotoServer = data.photos.photo[i].server;
                this.PhotoId = data.photos.photo[i].id;
                this.PhotoSecret = data.photos.photo[i].secret;
                this.PhotoSize = 'q';
                this.photoLink = `https://live.staticflickr.com/${this.PhotoServer}/${this.PhotoId}_${this.PhotoSecret}_${this.PhotoSize}.jpg`;
            }
            let thePhoto = new photosData().photoLink;
            arrayPhoto.push(thePhoto);
        }
    });

}

// -------------------------------------




// // -------------------------------------

// /*  Här fitchar vi länken för flickr och skapa object for img länken */
// // -------------------------------------


//


/*  Den här array kommer vara det sista array där finns bilderna blandade redan på ett rätt sätt  */



let ArrayforAllImg = [];
// -------------------------------------
/*  Denna async function för att bladar kort utan att det blir bara två som har samma img på ett random sätt varje gång  */
// -------------------------------------
async function addPhotoTArray() {
    await bildUrlforApi();
    let photoHtml, theImageRa, randomNumber;
    let ramdomImageArray = []; /* Här ska vi samla 12 eller 24 unika bilder varja gång från data */
    let duplicateForImageArray = []
    let kortantal = (GameLevel/2);/* 12 -4yes*/
    console.log(kortantal)
    // await fetchLink;
    while (ramdomImageArray.length < kortantal) {/* 12 -4yes */
        randomNumber = Math.floor(Math.random() * 499);/* 499 - 8 yes*/
        theImageRa = arrayPhoto[randomNumber];  /* Här hämtar vi en random bild av arrayPhoto som har 500 bilder */
        if (ramdomImageArray.indexOf(theImageRa) === -1) {
            ramdomImageArray.push(theImageRa);
            ArrayforAllImg.push(theImageRa);
            photoHtml = document.createElement('img');
            photoHtml.src = theImageRa;
        }
    }
    while (duplicateForImageArray.length < kortantal) {
        randomNumber = Math.floor(Math.random() * kortantal);
        theImageRa = ramdomImageArray[randomNumber];
        if (duplicateForImageArray.indexOf(theImageRa) === -1) {
            duplicateForImageArray.push(theImageRa);
            ArrayforAllImg.push(theImageRa);
            photoHtml = document.createElement('img');
            photoHtml.src = theImageRa;
        }
    }
    console.log(ArrayforAllImg)
}

// -------------------------------------

// Denna async function  för att skapa addEventListener för kort och varje bild och för att matcha kort och vända om dem 

// -------------------------------------


async function bildCard() {
    await addPhotoTArray();
    await skapaIDFörimg();
    comparecartFunctoin();
}

let unikIdforImg = [];
function skapaIDFörimg() {
    for (let i = 0; i < ArrayforAllImg.length; i++) {
        unikIdforImg.push(i + ArrayforAllImg[i])
    }
}

// -------------------------------------

let comparecartFunctoin = function () {

    let compareArray = []; /* för att jämfor varje gång länken för de två img som vi öpnnar i spelet */
    let img = [];  /* För att skapa och lägga till class och appendChild */
    let tempCompare = []; /* för att koden kommer ihåg vad hade vi för I nummer när vi öppnade kortet */
    let tempCompareForUnik = []; /* för att koden kommer ihåg vad hade vi för I nummer när vi öppnade kortet */
    skapaImgElementiArray()
    let imgElement = document.querySelectorAll('.img-element')
    skapaEvenetFörKort()
    // ------------------------------------



    function skapaImgElementiArray() {
        console.log(GameLevel)
        for (let i = 0; i <= (GameLevel-1); i++) {/*  23 - 7 yes*/     /* för att skapa alla kort och lägger till dem samma PNG img */
            img = document.createElement('img'); /*  */
            img.src = "/img/memorycard.png"
            img.classList.add('img-element');
            cardContent.appendChild(img);

        }
    }



    // ------------------------------------


    /* för att skapa addEventListener för varje kort */

    function skapaEvenetFörKort() {
        for (let i = 0; i <= (GameLevel-1); i++) {   /* 7 yes */
            imgElement[i].addEventListener('click', matchakort)
            function matchakort() {  
                if (tempCompareForUnik.indexOf(unikIdforImg[i]) == -1) {
                    mindraÄnTvåBilder();
                    tempCompareForUnik.push(unikIdforImg[i])
                }

                /* Vi kollar om vi har mindra än två url (kort) i compareArray som är tomt,
                om de är mindre än två,
                då kollar vi om den url som vi fick först från ArrayforAllImg-(där har vi redan bilderna blandade)- inte finns redan i compareArray,
                 om det inte finns då lägger till vi den till compareArray, 
                  och vi göra det process igen för nästa kort ,
                  då om det nya url inte finns i compareArray så det betyder att de är olika kort ,
                  annars om det nya url finns redan då betyder det att de två url (kort) är lika .
                  */
                function mindraÄnTvåBilder() {
                    if (compareArray.length < 2) {
                        if (compareArray.indexOf(ArrayforAllImg[i]) === -1) {
                            imgElement[i].classList.add('testflip')
                            imgElement[i].src = ArrayforAllImg[i];

                            tempCompare.push([i]);     /* För att hålla koll på vilket värde här (I) */
                            compareArray.push(ArrayforAllImg[i]); /* */
                            // imgElement[tempCompare[0][0]].removeEventListener('click', matchakort)
                            tvåOlikaBilder();
                        } else {
                            tvålikaBilder()
                        }
                    }
                }

                function tvåOlikaBilder() {
                    /* Vi kollar om  compareArray har två olika kort med olika url så vänder vi kort igen om 1000s */
                    if (compareArray.length == 2) {
                        console.log('dont Same')

                        setTimeout(
                            function () {
                                subtractScore();
                                imgElement[tempCompare[0]].classList.remove ('testflip');
                                imgElement[tempCompare[1]].classList.remove ('testflip');
                                imgElement[tempCompare[0]].src = "/img/memorycard.png"
                                imgElement[tempCompare[1]].src = "/img/memorycard.png"
                                tempCompare = [];
                                compareArray = [];
                                tempCompareForUnik = []
                                /* Här behöver vi tomma array efter vi är klara med den */
                                /* Här behöver vi tomma array efter vi är klara med den */
                            }, 2000
                        );
                    }
                }



                function tvålikaBilder() {
                    /* Här vet vi redam från förra function att det nya url finns readan i compareArray,
                          och det betyder att det två url är lika. */
                    tempCompare.push([i]);
                    compareArray.push(ArrayforAllImg[i]);
                    console.log('The same')
                    imgElement[i].src = ArrayforAllImg[i];
                    AddScore();
                    allMatched();
                    removeLestn();
                    function removeLestn() {
                        setTimeout(
                            function () {
                                let imgFixat1;
                                let imgFixat2;
                                imgFixat1 = document.createElement('img');
                                imgFixat2 = document.createElement('img');
                                imgFixat1.src = imgElement[tempCompare[0]].src
                                imgFixat2.src = imgElement[tempCompare[1]].src
                                imgFixat1.classList.add('img-element-fixat');
                                imgFixat2.classList.add('img-element-fixat');
                                cardContent.insertBefore(imgFixat1, cardContent.childNodes[(tempCompare[0][0]) + 1]);
                                cardContent.insertBefore(imgFixat2, cardContent.childNodes[(tempCompare[1][0]) + 1]);
                                imgElement[tempCompare[0][0]].remove();
                                imgElement[tempCompare[1][0]].remove();
                                compareArray = [];    /* Här behöver vi tomma array efter vi är klara med den */
                                tempCompare = [];
                                /* Här behöver vi tomma array efter vi är klara med den */
                            }, 1000
                        );
                    }
                }
            }
        }
    }
}




bildCard()



let score = 0;
let checkFinish = 0;
let ScoreBord = document.querySelector('.pairs-title');

function AddScore() {
    score +=5;
    checkFinish++;
    console.log(score);
    console.log(checkFinish);

    ScoreBord.textContent = 'Score : ' + score;

}


function subtractScore() {
    score -=1;
    console.log(score);
    console.log(checkFinish);
  ScoreBord.textContent = 'Score : ' + score;

}
// All cards matched 
function allMatched() {
    if (checkFinish === ArrayforAllImg.length / 2) {
        let scoreMessage = document.querySelector('.score-message');
        scoreMessage.textContent = 'You finished the game and your score is : ' + score;
        console.log(scoreMessage)
        console.log(score)
        popUp.style.visibility = "visible";
        secondSection.style.height = "0";
        secondSection.style.width = '0';
 
    }
}

let resetBtn = document.querySelector('.restart-btn');
resetBtn.addEventListener('click', function () {
    location.reload();
});

// Play again button 
playAgain.addEventListener('click', function () {
    secondSection.style.visibility = 'hidden';
    secondSection.style.height = "0";
    secondSection.style.width = '0';
    popUp.style.visibility = 'hidden';
    popUp.style.height = "0";
    popUp.style.width = '0';
    location.reload();
});





// -------------------
// Behövs göra 
/*  Att fixa utseende  
Anpassa med 48 kort
/*  fel hantering Catch  */
/*  fel meddeland  */
/*  fel read me */
/*  challabge vi hade */
/* Fixa kommerntarat 
 */

// ----------------------------------------
/*  vilka område hade vi  

/* Angilca : Disgn
Tara : räkna pöang
Tara och angilca : fixade knapparna med fuctioner 
Mohammad : Hämta data api
alla Tillsammans : matchade kort and resten av koden

 */
// --------------------------------
/* på mötet idag  : 

Vi kan fråga om  hur kan vi använda mer prototyp i vår kod eller på den nya koden vi har , 

vi kan fråga om import och export 

 */


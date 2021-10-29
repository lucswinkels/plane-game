// Wachten tot alle content geladen is voordat het script wordt uitgevoerd
document.addEventListener("DOMContentLoaded", () => {
    // Zet game op nog niet begonnen
    var startedGame = false;

    // Variabelen audio definiëren
    const bgm = new Audio("src/audio/bgm/bgm.mp3");
    bgm.volume = 0.1;
    bgm.loop = true;

    // Variabelen sidepanel definiëren
    var sidePanel = document.getElementById("controls-container");
    var sidePanelOpen = document.getElementById("open-panel");
    var sidePanelClose = document.getElementById("close-panel");

    // Click event aanmaken voor button om side panel te sluiten
    sidePanelClose.addEventListener('click', function () {
        sidePanel.style.opacity = "0";
        sidePanelClose.style.display = "none";
        sidePanelOpen.style.display = "block";
    })
    // Click event aanmaken voor button om side panel weer te openen
    sidePanelOpen.addEventListener('click', function () {
        sidePanel.style.opacity = "1";
        sidePanelClose.style.display = "block";
        sidePanelOpen.style.display = "none";
    });


    // Canvas met 2d element definiëren
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // Responsive grootte van canvas bepalen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Responsive grootte van object bepalen
    objectWidth = canvas.width / 10;
    objectHeight = canvas.height / 10;

    // Variabelen voor startpositie en beweging van object
    var x = Math.floor((canvas.width - objectWidth) / 2), // Start precies op het midden van de x-as door de objectgrootte van de x-offset af te halen
        y = Math.floor((canvas.height - objectHeight) / 2), // Start precies op het midden van de y-as door de objectgrootte van de y-offset af te halen
        velY = 0,
        velX = 0,
        speed = 5,
        friction = 0.97,
        keys = [];

    // Checken wanneer key wordt ingedrukt en losgelaten  
    document.body.addEventListener("keydown", function (e) {
        keys[e.key] = true;

    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.key] = false;
    });

    function fly() {
        requestAnimationFrame(fly);

        // Vliegtuig aanmaken
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        // Data ophalen voor alle vliegtuig types en hun snelheid
        var speedIndicator = document.getElementById("speed-indicator");

        var plane = document.getElementById("plane");
        var helicopter = document.getElementById("helicopter");
        var blimp = document.getElementById("blimp");
        var jet = document.getElementById("jet");

        var planeChecked = document.querySelector('input[value = "plane"]:checked');
        var helicopterChecked = document.querySelector('input[value = "helicopter"]:checked');
        var blimpChecked = document.querySelector('input[value = "blimp"]:checked');
        var jetChecked = document.querySelector('input[value = "jet"]:checked');

        // Kijk welk type vliegtuig is geselecteerd, pas snelheid en plaatjes aan op basis van selectie
        if (planeChecked != null) {
            ctx.drawImage(plane, x, y, objectWidth, objectHeight);
            speed = 5;
            speedIndicator.src = "src/img/assets/speed/speed-5.png";
        }
        if (helicopterChecked != null) {
            ctx.drawImage(helicopter, x, y, objectWidth, objectHeight);
            speed = 3;
            speedIndicator.src = "src/img/assets/speed/speed-3.png";
        }
        if (blimpChecked != null) {
            ctx.drawImage(blimp, x, y, objectWidth, objectHeight);
            speed = 1;
            speedIndicator.src = "src/img/assets/speed/speed-1.png";
        }
        if (jetChecked != null) {
            ctx.drawImage(jet, x, y, objectWidth, objectHeight);
            speed = 10;
            speedIndicator.src = "src/img/assets/speed/speed-10.png";
        }

        // WASD Keys definiëren - zodra er een wordt ingedrukt voer dit uit
        if (keys["w"] || keys["a"] || keys["s"] || keys["d"] || keys["W"] || keys["A"] || keys["S"] || keys["D"]) {
            // Verberg instructions
            instructions.classList.add("hidden");
            // Laat obstakels zien
            var obstacle = document.getElementById("obstacle");
            obstacle.style.display = "block";
            // Begin puntentelling 
            startedGame = true;
            // Initialiseer muziek
            bgm.play();

        }
        if (keys["w"] || keys["W"]) { // Als W ingedrukt wordt ga omhoog door Y coordinaat te verlagen
            if (velY > -speed) {
                velY--;
            }
        }
        if (keys["s"] || keys["S"]) { // Als S ingedrukt wordt ga omlaag door Y coordinaat te verhogen
            if (velY < speed) {
                velY++;
            }
        }
        if (keys["d"] || keys["D"]) { // Als D ingedrukt wordt ga naar rechts door X coordinaat te verhogen
            if (velX < speed) {
                velX++;
            }
        }
        if (keys["a"] || keys["A"]) { // Als A ingedrukt wordt ga naar links door X coordinaat te verlagen
            if (velX > -speed) {
                velX--;
            }
        }

        // Gebruik friction om acceleratie te simuleren door zichzelf te vermenigvuldigen en spring daarna weer naar juiste coordinaat
        velY *= friction;
        y += velY;
        velX *= friction;
        x += velX;

        // Limiet instellen (binnen canvas afmetingen blijven)
        if (x > canvas.width - objectWidth) {
            x = canvas.width - objectWidth;
        } else if (x <= 0) {
            x = 0;
        }

        if (y > canvas.height - objectHeight) {
            y = canvas.height - objectHeight;
        } else if (y <= 0) {
            y = 0;
        }

    }
    // User input
    let volumeControl = document.querySelector("#volume-control");
    volumeControl.defaultValue = bgm.volume * 100;
    volumeControl.addEventListener("change", function (e) {
        bgm.volume = e.currentTarget.value / 100;
    })

    // Puntensysteem
    var points = 0;
    // Check elke seconde puntentotaal en voeg elke seconde 10 punten toe
    setInterval(function () {
        if (startedGame == true) {
            points = points + 10;
            document.getElementById("points").innerHTML = points;
        }
    }, 1000);

    // Coordinaten van obstakels ophalen
    function getPos(el) {
        var rect = el.getBoundingClientRect();
        return {
            xc: rect.left,
            yc: rect.top
        };
    }

    // Check elke 100ms voor een botsing
    setInterval(function () {
        // Coordinaten voor obstakels
        var ob1Coords = getPos(document.querySelector(".obstacle-1"));
        var ob2Coords = getPos(document.querySelector(".obstacle-2"));
        var ob3Coords = getPos(document.querySelector(".obstacle-3"));
        var ob4Coords = getPos(document.querySelector(".obstacle-4"));
        var ob5Coords = getPos(document.querySelector(".obstacle-5"));
        var ob6Coords = getPos(document.querySelector(".obstacle-6"));
        var ob7Coords = getPos(document.querySelector(".obstacle-7"));
        var ob8Coords = getPos(document.querySelector(".obstacle-8"));

        // Stop coordinaten in array
        var obstacleCoordsX = new Array(ob1Coords.xc, ob2Coords.xc, ob3Coords.xc, ob4Coords.xc, ob5Coords.xc, ob6Coords.xc, ob7Coords.xc, ob8Coords.xc);
        var obstacleCoordsY = new Array(ob1Coords.yc, ob2Coords.yc, ob3Coords.yc, ob4Coords.yc, ob5Coords.yc, ob6Coords.yc, ob7Coords.yc, ob8Coords.yc);

        // Vergelijk eigen coordinaten met coordinaten in array met een radius van 50 (hoe dichtbij mag je komen)
        var i;
        var radius = 50;
        for (i = 0; i < obstacleCoordsX.length; i++) {
            // Vergelijk user coordinaat met obstakel coordinaat
            if (x >= obstacleCoordsX[i] - radius && x <= obstacleCoordsX[i] + radius && y >= obstacleCoordsY[i] - radius && y <= obstacleCoordsY[i] + radius) {
                collided();
            }
        }
    }, 100);

    // Wanneer er een botsing is haal er punten af en laat error zien
    var collision = document.getElementById("collision");
    const error = new Audio("src/audio/sounds/error.mp3");

    function collided() {
        collision.style.opacity = 1;
        points = points - 50;
        error.play();
        setTimeout(() => {
            collision.style.opacity = 0;
        }, 1000);
    }

    // Functie uitvoeren
    fly();
});
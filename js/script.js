class TextScramble {
    constructor(element) {
        this.element = element
        this.chars = '!<>-_\\/[]{}—=+*^?#________'
        this.update = this.update.bind(this)
    }
    setText(newText) {
        const oldText = this.element.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => this.resolve = resolve)
        this.queue = []
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''
            const to = newText[i] || ''
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 40)
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
    }
    update() {
        let output = ''
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i]
            if (this.frame >= end) {
                complete++
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar()
                    this.queue[i].char = char
                }
                output += `<span class="dud">${char}</span>`
            } else {
                output += from
            }
        }
        this.element.innerHTML = output
        if (complete === this.queue.length) {
            this.resolve()
        } else {
            this.frameRequest = requestAnimationFrame(this.update)
            this.frame++
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}

const phrases = [
    'A Human',
    'Tech Enthusiast',
    'Computer Engineering Undergraduate',
    'Programmer',
    'Software Developer',
    'Hobbyist Photographer',
    'Freelancer'
]

const el = document.querySelector("#titles")
const fx = new TextScramble(el)

let counter = 0
const next = () => {
    fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 1000)
    })
    counter = (counter + 1) % phrases.length
}

next()



function togglePopup() {
    document.querySelector("#timeline-full-screen").classList.toggle("hidden");
}




function toggleProgrammingLanguages() {
    document.querySelector("#programming-languages-skill-button").classList.toggle("skill-selected");

    let programmingLanguages = document.querySelectorAll(".programming-language");
    for (let i = 0; i < programmingLanguages.length; i++) {
        programmingLanguages[i].classList.toggle("skills-selected");
    }
}

function toggleFrameworkLibraries() {
    document.querySelector("#frameworks-libraries-skill-button").classList.toggle("skill-selected");

    let frameworksLibraries = document.querySelectorAll(".framework-library");
    for (let i = 0; i < frameworksLibraries.length; i++) {
        frameworksLibraries[i].classList.toggle("skills-selected");
    }
}

function toggleToolsTechnologies() {
    document.querySelector("#tools-technologies-skill-button").classList.toggle("skill-selected");

    let toolsTechnologies = document.querySelectorAll(".tool-technology");
    for (let i = 0; i < toolsTechnologies.length; i++) {
        toolsTechnologies[i].classList.toggle("skills-selected");
    }
}


let skills = document.querySelectorAll("#skill");
let skillContainer = document.querySelector("#skill-pool");
setSkillPositions();
window.addEventListener("resize", setSkillPositions);

function setSkillPositions() {
    let containerWidth = skillContainer.offsetWidth;
    let containerHeight = skillContainer.offsetHeight;

    let positions = [];

    for (let i = 0; i < skills.length; i++) {
        let element = skills[i];

        let elementWidth = element.offsetWidth;
        let elementHeight = element.offsetHeight;

        let maxX = containerWidth - elementWidth;
        let maxY = containerHeight - elementHeight;

        let randomX = Math.floor(Math.random() * maxX);
        let randomY = Math.floor(Math.random() * maxY);

        let overlapping = true;
        while (overlapping) {
            overlapping = false;
            for (let j = 0; j < positions.length; j++) {
                let position = positions[j];
                if (randomX < position.x + position.width &&
                    randomX + elementWidth > position.x &&
                    randomY < position.y + position.height &&
                    randomY + elementHeight > position.y) {
                    overlapping = true;
                    randomX = Math.floor(Math.random() * maxX);
                    randomY = Math.floor(Math.random() * maxY);
                    break;
                }
            }
        }

        element.style.left = randomX + 'px';
        element.style.top = randomY + 'px';

        positions.push({ x: randomX, y: randomY, width: elementWidth, height: elementHeight });
    }
}
// function setSkillPositions() {
//     let skillContainerWidth = skillContainer.offsetWidth;
//     let skillContainerHeight = skillContainer.offsetHeight;

//     for (let i = 0; i < skills.length; i++) {
//         let element = skills[i];

//         let elementWidth = element.offsetWidth;
//         let elementHeight = element.offsetHeight;

//         let maxX = skillContainerWidth - elementWidth;
//         let maxY = skillContainerHeight - elementHeight;

//         let randomX = Math.floor(Math.random() * maxX);
//         let randomY = Math.floor(Math.random() * maxY);

//         element.style.left = randomX + 'px';
//         element.style.top = randomY + 'px';
//     }
// }









let isDragging = false;
let startX, scrollLeft, container;

document.addEventListener("mousedown", (e) => {
    container = e.target.closest("#experience-cards, #project-cards, #achievement-cards, #certification-cards, #timeline-content");
    if (container) {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mouseleave", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    requestAnimationFrame(() => {
        container.scrollLeft = scrollLeft - walk;
    });
});





const blob = document.querySelector("#blob");

window.onpointermove = event => {
    const { pageX, pageY } = event;
    // target.style.setProperty("--mouse-x",`${pageX}px`);
    // target.style.setProperty("--mouse-y",`${pageY}px`);

    blob.animate(
        {
            left: `${pageX}px`,
            top: `${pageY}px`
        },
        { duration: 3000, fill: "forwards" }
    );
};




function leftScroll() {
    const left = document.querySelector("#timeline-content");
    left.scrollBy(-10, 0);
}

function rightScroll() {
    const right = document.querySelector("#timeline-content");
    right.scrollBy(10, 0);
}




// const nameBackground = document.querySelector(".name");

// nameBackground.addEventListener("mousemove", (e) => {
//     nameBackground.style.backgroundPositionX = -e.offsetX + "px";
//     nameBackground.style.backgroundPositionY = -e.offsetY + "px";
// });


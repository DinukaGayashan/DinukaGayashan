
const blob = document.querySelector('#blob');

document.addEventListener('mousemove', e => {
    const targetX = e.clientX;
    const targetY = e.clientY;

    blob.animate(
        {
            left: targetX + 'px',
            top: targetY + 'px'
        },
        {
            duration: 3000,
            fill: "forwards"
        }
    );
});



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

const title = document.querySelector("#titles");
const textScramble = new TextScramble(title);

const titles = [
    'A Human',
    'Tech Enthusiast',
    'Computer Engineering Undergraduate',
    'Programmer',
    'Software Developer',
    'Hobbyist Photographer',
    'Freelancer'
];

let counter = 0
const changeTitle = () => {
    textScramble.setText(titles[counter]).then(() => {
        setTimeout(changeTitle, 1500)
    })
    counter = (counter + 1) % titles.length
};

changeTitle();



function togglePopup() {
    document.querySelector("#timeline-full-screen").classList.toggle("hidden");
}


function leftScroll() {
    const timeline = document.querySelector("#timeline-content");
    timeline.scrollBy(-10, 0);
}

function rightScroll() {
    const timeline = document.querySelector("#timeline-content");
    timeline.scrollBy(10, 0);
}


let programmingLanguages = document.querySelectorAll(".programming-language");
let frameworksLibraries = document.querySelectorAll(".framework-library");
let toolsTechnologies = document.querySelectorAll(".tool-technology");
let skills = Array.from(programmingLanguages)
    .concat(Array.from(frameworksLibraries))
    .concat(Array.from(toolsTechnologies));
let skillContainer = document.querySelector("#skill-pool");

setSkillPositions();
window.addEventListener("resize", setSkillPositions);
skillContainer.addEventListener("click", setSkillPositions);

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

function toggleProgrammingLanguages() {
    document.querySelector(".skill-category.programming-languages").classList.toggle("skill-selected");
    for (let i = 0; i < programmingLanguages.length; i++) {
        programmingLanguages[i].classList.toggle("skills-selected");
    }
}

function toggleFrameworkLibraries() {
    document.querySelector(".skill-category.frameworks-libraries").classList.toggle("skill-selected");

    for (let i = 0; i < frameworksLibraries.length; i++) {
        frameworksLibraries[i].classList.toggle("skills-selected");
    }
}

function toggleToolsTechnologies() {
    document.querySelector(".skill-category.tools-technologies").classList.toggle("skill-selected");
    for (let i = 0; i < toolsTechnologies.length; i++) {
        toolsTechnologies[i].classList.toggle("skills-selected");
    }
}


const handleOnMouseMove = e => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
}

for (const card of document.querySelectorAll(".card")) {
    card.onpointermove = e => handleOnMouseMove(e);
}

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
    const walk = (x - startX) * 2;
    requestAnimationFrame(() => {
        container.scrollLeft = scrollLeft - walk;
    });
});


function openURL(url) {
    window.open(url);
}

let date = new Date();
document.querySelector("#date").innerText = date.getFullYear();






const blob = document.querySelector('#blob');

document.addEventListener('mousemove', e => {
    const targetX = e.clientX + 'px';
    const targetY = e.clientY + 'px';

    blob.animate(
        {
            left: targetX,
            top: targetY
        },
        {
            duration: 1000
        }
    ).onfinish = () => {
        blob.style.left = targetX;
        blob.style.top = targetY;
    };    
});


class TextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.element.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const title = document.querySelector('#titles');
const textScramble = new TextScramble(title);
const titles = [
    'A Human',
    'Tech Enthusiast',
    'Computer Engineering Undergraduate',
    'Programmer',
    'Software Developer',
    'Hobbyist Photographer',
];
let counter = 0;

function changeTitle() {
    textScramble.setText(titles[counter]).then(() => {
        setTimeout(changeTitle, 1500);
    });
    counter = (counter + 1) % titles.length;
};

changeTitle();


const hellos = [
    'Hello', 'ආයුබෝවන්', 'வணக்கம்', 'नमस्ते', 'Hola', 'Bonjour', 'こんにちは', 'Ciao',
    'Salve', 'Aloha', '안녕하세요', 'Merhaba', 'привет', 'Olá', '你好'
];
let index = 0;

function changeHello() {
    const helloElement = document.querySelector('#hello');
    helloElement.style.opacity = 0;

    setTimeout(() => {
        helloElement.textContent = hellos[index];
        helloElement.style.opacity = 1;
        index = (index + 1) % hellos.length;
    }, 500);
}

setInterval(changeHello, 3000);


function toggleTimelinePopup() {
    document.querySelector('#timeline-full-screen').classList.toggle('hidden');
}

function leftScroll() {
    const timeline = document.querySelector('#timeline-content');
    timeline.scrollBy(-10, 0);
}

function rightScroll() {
    const timeline = document.querySelector('#timeline-content');
    timeline.scrollBy(10, 0);
}


const programmingLanguages = document.querySelectorAll('.programming-language');
const frameworksLibraries = document.querySelectorAll('.framework-library');
const toolsTechnologies = document.querySelectorAll('.tool-technology');
const skills = Array.from(programmingLanguages)
    .concat(Array.from(frameworksLibraries))
    .concat(Array.from(toolsTechnologies));
const skillContainer = document.querySelector('#skill-pool');

function setSkillPositions() {
    const containerWidth = skillContainer.offsetWidth;
    const containerHeight = skillContainer.offsetHeight;
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
                if (
                    randomX < position.x + position.width &&
                    randomX + elementWidth > position.x &&
                    randomY < position.y + position.height &&
                    randomY + elementHeight > position.y
                ) {
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

setSkillPositions();
window.addEventListener('resize', setSkillPositions);
skillContainer.addEventListener('click', setSkillPositions);


function toggleProgrammingLanguages() {
    document.querySelector('.programming-languages').classList.toggle('skill-selected');
    for (let i = 0; i < programmingLanguages.length; i++) {
        programmingLanguages[i].classList.toggle('skills-selected');
    }
}

function toggleFrameworkLibraries() {
    document.querySelector('.frameworks-libraries').classList.toggle('skill-selected');
    for (let i = 0; i < frameworksLibraries.length; i++) {
        frameworksLibraries[i].classList.toggle('skills-selected');
    }
}

function toggleToolsTechnologies() {
    document.querySelector('.tools-technologies').classList.toggle('skill-selected');
    for (let i = 0; i < toolsTechnologies.length; i++) {
        toolsTechnologies[i].classList.toggle('skills-selected');
    }
}


document.querySelectorAll('.card').forEach(card => {
    card.onpointermove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`);
        currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`);
    };
});



let isDragging = false;
let startX, scrollLeft, container;

document.addEventListener('mousedown', (e) => {
    container = e.target.closest('#experience-cards, #project-cards, #achievement-cards, #certification-cards, #timeline-content');
    if (container) {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mouseleave', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    requestAnimationFrame(() => {
        container.scrollLeft = scrollLeft - walk;
    });
});


function expandSocialList() {
    const content = document.querySelector('#social-list-more');
    const arrow = document.querySelector('#arrow');

    content.classList.toggle('expanded');
    if (content.classList.contains('expanded')) {
        arrow.classList.remove('fa-angle-down');
        arrow.classList.add('fa-angle-up');
    } else {
        arrow.classList.remove('fa-angle-up');
        arrow.classList.add('fa-angle-down');
    }
}


function openURL(url) {
    window.open(url);
}


document.querySelector('#date').innerText = new Date().getFullYear();

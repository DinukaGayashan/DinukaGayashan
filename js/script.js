class TextScramble {
    constructor(el) {
        this.el = el
        this.chars = '!<>-_\\/[]{}—=+*^?#________'
        this.update = this.update.bind(this)
    }
    setText(newText) {
        const oldText = this.el.innerText
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
        this.el.innerHTML = output
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

const el = document.querySelector('.titles')
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
    document.querySelector(".timeline-full-screen").classList.toggle("hidden");
}



let isDragging = false;
let startX, scrollLeft, container;

document.addEventListener("mousedown", (e) => {
    container = e.target.closest("#experience-cards, #project-cards, #achievement-cards, #certification-cards");
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





const blob = document.getElementById("blob");

window.onpointermove = event => {
  const { pageX, pageY } = event;

  blob.animate(
    {
      left: `${pageX}px`,
      top: `${pageY}px`
    },
    { duration: 2000, fill: "forwards" }
  );
};




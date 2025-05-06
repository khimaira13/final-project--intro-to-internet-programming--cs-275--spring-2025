window.onload = () => {
    let input;
    let size;
    let container;
    let i;
    let spaces;
    let stars;
    let diamond;
    let charWidth;
    let lineHeight;
    let pos;
    let direction;
    let maxSlide;
    let speed;
    let lastTimestamp;
    let valid = false;

    while (!valid) {
        input = prompt(`Enter the size of your diamond as a number.`);
        size = Number(input);

        if (input !== null && Number.isInteger(size) && size >= 1) {
            valid = true;
        }
    }

    container = document.getElementById(`diamond-container`);
    container.innerHTML = ``;
    diamond = ``;

    if (size % 2 === 1) {
        // Odd sized diamond
        let mid = Math.floor(size / 2);
        for (i = 0; i < size; i++) {
            stars = size - 2 * Math.abs(mid - i);
            spaces = Math.abs(mid - i);
            diamond += ` `.repeat(spaces) + `*`.repeat(stars) + `\n`;
        }
    } else {
        // Even sized diamond
        let lines = [];
        // Build top half + middle
        for (let i = 1; i <= size; ) {
            let chars = Array(i).fill(`*`).join(` `);  // e.g. '* * * * *'
            let padding = Math.floor((2 * size - 1 - chars.length) / 2);
            lines.push(` `.repeat(padding) + chars + ` `.repeat(padding));
            if(i===1){
                i++;
            }
            else{
                i+=2;
            }
        }

        // Build bottom half
        if(size===2){
            let chars = Array(i).fill(`*`).join(` `);
            let padding = Math.floor((2 * size - 1 - chars.length) / 2);
            lines.push(` `.repeat(padding) + chars + ` `.repeat(padding));
        }
        else{
            for (let i = size-2; i >= 1; ) {
                let chars = Array(i).fill(`*`).join(` `);
                let padding = Math.floor((2 * size - 1 - chars.length) / 2);
                lines.push(` `.repeat(padding) + chars + ` `.repeat(padding));
                if(i===2){
                    i--;
                }
                else{
                    i-=2;
                }
            }
        }

        diamond = lines.join(`\n\n`);
        container.textContent = diamond;

    }
    charWidth = diamond.size;
    lineHeight = diamond.size;
    container.textContent = diamond.trimEnd();

    let boxWidth = Math.ceil((size + 1) * charWidth);
    let boxHeight = Math.ceil((size + 1) * lineHeight);

    container.style.width = `${boxWidth}px`;
    container.style.height = `${boxHeight}px`;

    pos = 0;
    direction = 1;
    speed = 500;

    let updateMaxSlide = () => {
        maxSlide = window.innerWidth - container.offsetWidth;
    };

    updateMaxSlide();

    let step = (timestamp) => {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }

        let delta = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        pos += direction * speed * delta;

        if (pos >= maxSlide) {
            pos = maxSlide;
            direction = -1;
        } else if (pos <= 0) {
            pos = 0;
            direction = 1;
        }

        container.style.left = `${pos}px`;
        window.requestAnimationFrame(step);
    };

    window.addEventListener(`resize`, updateMaxSlide);
    window.requestAnimationFrame(step);
};

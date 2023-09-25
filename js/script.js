const CanvasEl = document.querySelector("canvas"), 
 CanvasCtx = CanvasEl.getContext("2d"),  
 gapX = 10;

const mouse = { x: 0, y: 0 }

 // DESENHA O CAMPO
const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function() {
        CanvasCtx.fillStyle = "#286047";
        CanvasCtx.fillRect(0, 0, this.w, this.h);
    }
}

// DESENHA A LINHA DO MEIO
const line = {
    w: 15,
    h: field.h,
    draw: function() {
        CanvasCtx.fillStyle = "#ffffff"
        CanvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
    },
}

// DESENHA A RAQUETE ESQUERDA
const leftPaddle = {
    x: gapX,
    y: 400,
    w: line.w,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h / 2;
    },
    draw: function() {
        CanvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

// DESENHA A RAQUETE DIREITA
const rigthPaddle = {
    x: field.w - line.w - gapX,
    y: 400,
    w: line.w,
    h: 200,
    speed: 10,
    _move: function() {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
    },
    speedUp: function() {
        this.speed += 1;
    },
    draw: function() {
        CanvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

// DESENHA O PLACAR
const score = {
    human: 0,
    computer: 0,
    increaseHuman: function() {
        this.human++;
    },
    increaseComputer: function() {
        this.computer++;
    },
    draw: function() {
        CanvasCtx.font = "bold 72px Arial";
        CanvasCtx.textAlign = "center";
        CanvasCtx.textBaseline = "top";
        CanvasCtx.fillStyle = "#01341D";
        CanvasCtx.fillText(this.human, field.w / 4, 50);
        CanvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50);
    }
}

// DESENHA A BOLINHA 
const ball = { 
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 6,
    directionX: 1,
    directionY: 1,
    _calcPosition: function() {
        // VERIFICA SE O JOGADOR 1 FEZ UM PONTO (X > LARGURA DO CAMPO)
        if(this.x > field.w - this.r - rigthPaddle.w - gapX) {
            if(
                this.y + this.r > rigthPaddle.y && 
                this.y - this.r < rigthPaddle.y + rigthPaddle.h
            ) {
                // rebate a bola invertendo o sinal de x
                this._reverseX();
            } else {
                // pontuar jogador 1
                score.increaseHuman();
                this._pointUp();
            }
        }
        // Verificar se o jogador 2 fez um ponto (x < 0)
        if(this.x < this.r + rigthPaddle.w + gapX) {
            // verifica se a raqute esquerda está na posição y da bola
            if(
                this.y + this.r > leftPaddle.y && 
                this.y - this.r < leftPaddle.y + leftPaddle.h
            ) {
                // rebate a bola invertendo o sinal de x
                this._reverseX();
            } else {
                // pontuar jogador 2
                score.increaseComputer();
                this._pointUp();
            }
        }
        
        // VERIFICA AS LATERAIS SUPERIORES E INFERIORES DO CAMPO
        if(
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
            this._reverseY();
        }
    },
    _reverseX: function() {
        this.directionX *= -1;
    },
    _reverseY: function() {
        this.directionY *= -1;
    },
    _speedUp: function() {
        this.speed += 2;
    },
    _pointUp: function() {
        rigthPaddle.speedUp();

        this.x = field.w / 2;
        this.y = field.h /2;
    },
    _move: function() {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },
    draw: function() {
        CanvasCtx.fillStyle = "#ffffff"
        CanvasCtx.beginPath();
        CanvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        CanvasCtx.fill();

        this._calcPosition();
        this._move();
    }
}

function setup() {
    CanvasEl.width = CanvasCtx.width = field.w;
    CanvasEl.height = CanvasCtx.height = field.h;
}

function draw() {
    field.draw();
    line.draw();
    
    leftPaddle.draw();
    rigthPaddle.draw();
    
    score.draw();
    
    ball.draw();
}

window.animateFrame = (function(){
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    )
})();

function main() {
    animateFrame(main);
    draw();
}

window.setInterval(myCallback, 3000);

function myCallback() {
    ball._speedUp();
}

setup();
main();

CanvasEl.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});


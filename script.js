let isFirstScreen = true;
let isSecondScreen = false;
let isThirdScreen = false;
let isFourthScreen = false;


let secondScreen = document.getElementById("canvas1");
secondScreen.classList.add("masked");

let counter = 0;
let borderprogessionbar = document.querySelector(".progressionbar");
borderprogessionbar.classList.add("masked");

let progressionBar = document.querySelector(".progressionbarfiller");
progressionBar.style.width = "0%";

function ChangeScene()
{
    pageTransition.classList.remove("masked");
    pageTransition.style.animation = "";
    pageTransition.style.animation += "transitionScene 0.7s ease-in-out forwards";
    setTimeout(() => {
      pageTransition.classList.add("masked");
    },700)

}

function mouseGradient(event) {
  let x = event.clientX;
  let y = event.clientY;

  let radialGradient = `radial-gradient(circle 12vw at ${x}px ${y}px, rgba(255, 227, 190, 0.93), white)`;
  document.body.style.background = radialGradient;
}


let pageTransition = document.getElementById("blackTransition");

if (isFirstScreen == true) {
  window.addEventListener("mousemove", mouseGradient);
}


/* second écran poussière*/



document.getElementById("text").addEventListener("click", function()
{
  isFirstScreen = false;
  console.log(isFirstScreen);
 ChangeScene();

  isSecondScreen = true;
  window.removeEventListener("mousemove", mouseGradient);


    document.getElementById("text").classList.add("masked");
    document.querySelector(".firstScreen").classList.add("masked");
    document.body.style.background = "";
    document.body.style.background += "black";

    setTimeout(() => {
      secondScreen.classList.remove("masked");
      borderprogessionbar.classList.remove("masked");
    }, 700);
    



    console.log(document.getElementById("text"));
    

    
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d", {
        willReadFrequently:true
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle
    {
        constructor(effect, x, y, color)
        {
            this.effect = effect;
            this.x = x * Math.random() * this.effect.canvasWidth;
            this.y = y * Math.random() * this.effect.canvasHeight;
            this.color = color;
            this.originX = x;
            this.originY = y;
            this.size = this.effect.gap;
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = Math.random() * 0.6 + 0.15;
            this.ease = Math.random() * 0.1 + 0.005;
        }
        draw()
        {
             this.effect.context.fillStyle = this.color;
             this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }
        update()
        {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;

            this.distance = this.dx * this.dx + this.dy * this.dy;

            this.force = this.effect.mouse.radius/this.distance;

            if(this.distance < this.effect.mouse.radius)
            {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

          this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
          this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;

        }
    }
    

    class Effect {
        constructor(context, canvasWidth, canvasHeight)
        {
          this.context = context;
          this.canvasWidth = canvasWidth;
          this.canvasHeight = canvasHeight;

          this.textX = this.canvasWidth / 2;
          this.textY = this.canvasHeight / 2;
          this.fontSize = 160;
          this.lineHeight = this.fontSize * 0.9;
          this.maxTextWidth = this.canvasWidth * 0.8;
          this.textInput = document.getElementById("textInput");
          this.textInput.addEventListener("keyup", (e) => {
              this.context.clearRect(0,0, this.canvasWidth, this.canvasHeight);

              if(e.key !== ' ')
              {
                this.context.clearRect(0,0, this.canvasWidth, this.canvasHeight);
                this.WrappedText(e.target.value);
              }
              
          }
          );
          
          // text in particles
          this.particles = [];
          this.gap = 1;

          this.mouse = {
            radius : 20000,
            x: 0,
            y:0
          }

          window.addEventListener("mousemove", (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
          }); 

          
        }
        WrappedText(text)
        {
            const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
            gradient.addColorStop(0.3,'#664029');
            gradient.addColorStop(0.5,'#9e783f');
            gradient.addColorStop(0.7,'#cca768');
             this.context.fillStyle = gradient;
             this.context.textAlign = "center";
             this.context.textBaseline = "middle";
             this.context.font = this.fontSize + "px Helvetica";

             // 

            let linesArray = [];
            let lineCounter = 0;
            let line = ' ';
            let words = text.split(' ');
            for(let i = 0; i < words.length; i++)
            {
                let testLine = line + words[i] + ' ';
                 if(this.context.measureText(testLine).width > this.maxTextWidth)
                 {
                    lineCounter++;
                    line = words[i] + ' ';
                    
                 }
                 else
                    {
                        line = testLine;
                    }
                    linesArray[lineCounter] = line; 
            }

            let textHeight = this.lineHeight * lineCounter;
            this.textY = this.canvasHeight/2 - textHeight / 2;

            linesArray.forEach((el, index) =>
            {
                this.context.fillText(el, this.textX, this.textY + (index * this.lineHeight));
            })

            //
           
            this.convertToParticles();


        }
        convertToParticles()
        {
          this.particles = [];
          const pixels = this.context.getImageData(0,0, this.canvasWidth, this.canvasHeight).data;
          this.context.clearRect(0,0, this.canvasWidth, this.canvasHeight);

          for(let y = 0; y < this.canvasHeight; y += this.gap)
          {
            for( let x = 0; x < this.canvasWidth; x += this.gap)
            {
                const index = (y * this.canvasWidth + x ) * 4;
                const alpha = pixels[index + 3];
                if(alpha > 0)
                {
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];

                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

                    this.particles.push(new Particle(this, x, y, color));
                    
                }
            }
          }


        }
        
        render()
        {
          this.particles.forEach(particle =>
          {
            particle.draw();
            particle.update();  
          }
          )
        }
        
    }

    const effect = new Effect(ctx, canvas.width, canvas.height);
    effect.WrappedText(effect.textInput.value);
    effect.render();


    function animate()
    {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }

    animate();

});

/* quatrième écran pétale*/



function FourthScreen(){

let textePrintemps = document.createElement('div');
textePrintemps.classList.add('textePrintemps');
textePrintemps.innerHTML = `八萬年前`;
document.body.appendChild(textePrintemps);


let flowersCounter = 0;

let placedFlowers = [];
let minDistance = 100; 

function minimalDistance(x,y)
{
  for(let pos of placedFlowers)
  {
    let dx = x - pos.x;
    let dy = y - pos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < minDistance) {
      return false;
    }
  }
  return true;
}

function CreateFlower()
{
let flower = document.createElement('div');
flower.classList.add('flower');

let colors = ["#f2bfd2", "#ed7983", "#f5b887", "#f7cf88", "#abaeed"];


let margin = 120;
let randomX, randomY;

do{
randomX = Math.random() * (window.innerWidth - 2 * margin) + margin;
randomY = Math.random() * (window.innerHeight - 2 * margin) + margin;
}while(!minimalDistance(randomX,randomY));

flower.style.position = 'absolute';
  flower.style.left = randomX  + 'px';
  flower.style.top = randomY  + 'px';
flower.style.scale = 0.1;
flower.style.backgroundColor = colors[Math.floor(Math.random() * 5)];
; 
flower.style.borderRadius = '50%';
flower.style.overflow = 'hidden';



flower.innerHTML = `
  <span class="petal"></span>
  <span class="petal"></span>
  <span class="petal"></span>
  <span class="petal"></span>
  <span class="petal"></span>
`;
let petals = flower.querySelectorAll('.petal'); 
let index = 0;

petals.forEach(petal => {
  petal.style.transform = `rotate(${index}deg)`;
  petal.style.backgroundColor = flower.style.backgroundColor;
  index += 74;
});


let isFlowerAppears = false;


  flower.addEventListener('mouseenter', () =>
  {
    
    flower.style.scale = 1;
    flower.style.backgroundColor = 'transparent';
    flower.style.borderRadius = '0%';
   flower.style.overflow = 'visible';

    flower.style.animation = ' ';

    if(isFlowerAppears == false)
    {
    flowersCounter++;
    flower.style.animation += 'blooming 3s ease-in-out forwards';
    isFlowerAppears = true;
    console.log(flowersCounter);
    if(flowersCounter >= 9)
  {
    textePrintemps.style.display = 'flex';
    textePrintemps.style.animation = 'text-appear 2s ease-in-out forwards';
  }
    }
    else{
      flower.style.animation += 'petale-rotate 2s ease-in';
    }
    
  })
  
 
  document.body.appendChild(flower);
  placedFlowers.push({x: randomX, y: randomY});
}



for(let i = 0; i < 15; i++)
{
  
  CreateFlower();
}

}





/* troisième écran monde */

const caracters = [
  { caracter: "三", baseGradient: "rgba(255,212,182,1), rgba(0,30,111,1)" },
  { caracter: "千", baseGradient: "rgba(255,237,209,1), rgb(0, 75, 161), rgb(149, 216, 255)" },
  { caracter: "界", baseGradient: "rgba(255,246,209,1), rgb(255, 105, 105), rgba(72,177,255,1)" },
];

function ThirdScreen() {
  document.body.style.display = "flex";
  document.body.style.justifyContent = "center";
  document.body.style.alignItems = "center";

  const elements = [];
  let activeGradient = null;

  caracters.forEach(element => {
    const caracter = document.createElement("h1");
    caracter.innerHTML = element.caracter;
    caracter.classList.add("caracter-color");
    
caracter.addEventListener("click",() => {
    ChangeScene();
    setTimeout(() => {
      /* transition 4eeme ecran */
      document.body.style.background = "";
      document.body.style.background += "#f8ecf3";
      isThirdScreen = false;
      isFourthScreen = true;
      document.querySelectorAll(".caracter-color").forEach((el) => {
        el.classList.add("masked");
      });
      console.log(isThirdScreen);
      if(isFourthScreen == true)
      {
        FourthScreen();
      }
    }, 700);
      
    })
    
  
    caracter.dataset.gradient = element.baseGradient;
    document.body.appendChild(caracter);
    elements.push(caracter);

    caracter.addEventListener("mouseenter", () => {
      activeGradient = element.baseGradient;
    });

    caracter.addEventListener("mouseleave", () => {
      activeGradient = null;
      document.body.style.background = "black"; 
    });
  });

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    elements.forEach(el => {
      const gradientStops = el.dataset.gradient;
      const gradient = `radial-gradient(circle at ${x}px ${y}px, ${gradientStops})`;
      el.style.setProperty("--gradient", gradient);
    });

    if (activeGradient) {
      const bodyGradient = `radial-gradient(circle at ${x}px ${y}px, ${activeGradient})`;
      document.body.style.background = bodyGradient;
    }
  });

 
}




/*transition du secondscreen*/
secondScreen.addEventListener("mousemove", function(){
  console.log(counter);
  counter++;
  progressionBar.style.width = counter*2/10 + "%";
  if(counter >= 500)
    {
     
      ChangeScene();
      setTimeout(() => {
        secondScreen.classList.add("masked");
      borderprogessionbar.classList.add("masked");
      isFirstScreen = false;
      isSecondScreen = false;
      document.body.style.background = "black";
      console.log(isSecondScreen);
       if(isSecondScreen == false && isFirstScreen == false)
    {
  isThirdScreen = true;

  if(isThirdScreen === true)
{  
  ThirdScreen()
}
  }
      }, 700);
    }
}
)













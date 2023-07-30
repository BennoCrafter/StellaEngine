export class GameEngine {
    constructor() {
      this.current_key = null;
      this.mouse_pos = [];
      this.clicked_mouse = false;
  
      // Canvas element and context
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext("2d");
  
      // Game objects and settings
      this.objects = [];
      this.interval = null;
    }
  
    init(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  
      // Listeners to track user inputs
      window.addEventListener("keydown", (e) => {
        this.current_key = e.key;
      });
  
      window.addEventListener("keyup", (e) => {
        this.lastKeyPressed = this.current_key;
        this.current_key = null;
      });
  
      window.addEventListener("mousedown", (evt) => {
        this.clicked_mouse = true;
      });
  
      window.addEventListener("mouseup", (evt) => {
        this.clicked_mouse = false;
      });
  
      window.addEventListener("mousemove", (evt) => {
        this.mouse_x = evt.pageX;
        this.mouse_y = evt.pageY;
      });
    }
  
    start() {
      for (let i = 0; i < this.objects.length; i++) {
        if (this.objects[i].init) {
          this.objects[i].init();
        }
      }
  
      this.interval = setInterval(() => {
        this.sprite_update();
        this.draw();
        this.update();
        this.game_update();
      }, 20);
    }
  
    stop() {
      clearInterval(this.interval);
    }
    
    game_update() {
      
    }

    update() {
      // User-defined function for updating the game state
    }
  
    sprite_update() {
      for (let i = 0; i < this.objects.length; i++) {
        if (this.objects[i].sprite_update) {
          this.objects[i].sprite_update();
        }
      }
    }
  
    draw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
      for (let i = 0; i < this.objects.length; i++) {
        const obj = this.objects[i].data;
    
        this.context.save(); // Save the current context state
    
        this.context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2); // Translate to the center of the object
        this.context.rotate(obj.rotation * (Math.PI / 180)); // Rotate the context
    
        if (obj.type === "text") {
          this.context.font = obj.font;
          this.context.fillStyle = obj.color;
          this.context.fillText(obj.text, -obj.width / 2, -obj.height / 2);
        } else if (obj.type === "rectangle") {
          this.context.fillStyle = obj.color;
          this.context.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        } else if (obj.type === "circle") {
          this.context.beginPath();
          this.context.arc(0, 0, obj.width / 2, 0, 2 * Math.PI);
          this.context.fillStyle = obj.color;
          this.context.fill();
        } else if (obj.type === "custom") {
          const img = new Image();
          img.src = obj.img_src;
          this.context.drawImage(img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
        }
    
        this.context.restore(); // Restore the previous context state
      }
    }
    
  
    hide_mouse_cursor() {
      this.canvas.style.cursor = "none";
    }
  
    show_mouse_cursor(type = "default") {
      const types = ["wait", "help", "move", "pointer", "none", "crosshair", "cell"];
      this.canvas.style.cursor = types.includes(type) ? type : "default";
    }
  
    getKey() {
      return this.current_key;
    }
  
    pressedKey(key) {
      return key === this.current_key;
    }
  
    getMousePos() {
      return [this.mouse_x, this.mouse_y];
    }
  
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
  
    collided(obj1, obj2) {
      // Check if the objects' rectangular boundaries intersect
      if (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      ) {
        // Collision detected
        return true;
      } else {
        // No collision
        return false;
      }
    }
  
    deleteGameObject(obj) {
      if (this.objects.includes(obj)) {
        const index = this.objects.indexOf(obj);
        if (index > -1) {
          this.objects.splice(index, 1);
        }
        for (const prop in obj) {
          delete obj[prop];
        }
      }
    }
  
    addObject(obj) {
      if (Array.isArray(obj)) {
        this.objects.push(...obj);
      } else {
        this.objects.push(obj);
      }
    }
  }
  
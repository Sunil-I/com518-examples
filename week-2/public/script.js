class Car {
  constructor(make, model, capacity, top_speed) {
    this.make = make;
    this.model = model;
    this.capacity = capacity;
    this.top_speed = top_speed;
    this.current_speed = 0;
  }
  accelerate(speed) {
    if (this.current_speed + speed > this.top_speed)
      return "New speed is above top speed.";
    return (this.current_speed = this.current_speed + speed);
  }
  decelerate(speed) {
    if (this.current_speed - speed < 0) return "New speed is below 0.";
    return (this.current_speed = this.current_speed - speed);
  }
  toString() {
    return `make: ${this.make} model: ${this.model}  capacity: ${this.capacity} top_speed: ${this.top_speed} current_speed: ${this.current_speed}`;
  }
}

document.getElementById("btn").addEventListener("click", () => {
  const car = new Car("Telsa", "Model S", "615", "199.5");
  alert(car);
  car.accelerate(50);
  alert(car);
  car.decelerate(25);
  alert(car);
});


class Complex{
  
    constructor(re, im){
      this.re = re;
      this.im = im;
    }

    int_power(p){
      let result = new Complex(1, 0)
      let cur = this.clone()
      for(let i = 1 ; i <= p ; i<<=1){
        if((p & i) != 0)
          result.times(cur)
        cur.square()
      }
      return result
    }

    real_power(p){
      let angle = this.angle()
      let r = this.length()
      let newR = pow(r, p);
      let newAngle = p * angle;
      return fromAngle(newAngle, newR)
    }
    
    complex_power(c){
      let angle = this.angle()
      let r = this.length()
      if(r === 0)
        return new Complex(0, 0)
      let lnR = log(r)
      let newR = exp(lnR * c.re - c.im * angle);
      let newAngle = lnR * c.im + c.re * angle;
      return fromAngle(newAngle, newR)
    }

    squared(){
      return new Complex(this.re * this.re - this.im * this.im, 2 * this.re * this.im)
    }

    square(){
      let aux = this.re;
      this.re = this.re * this.re - this.im * this.im;
      this.im = 2 * aux * this.im;
    }

    times(c){
      let aux = this.re;
      this.re = this.re * c.re - this.im * c.im;
      this.im = aux * c.im + this.im * c.re;
    }

    scale(s){
      this.re *= s;
      this.im *= s;
    }
    
    add(c){
      this.re += c.re
      this.im += c.im
    }
    
    subtract(c){
      this.re -= c.re
      this.im -= c.im
    }
    
    lengthSquared(){
      return this.re * this.re + this.im * this.im;
    }
    
    length(){
      return sqrt(this.lengthSquared())
    }

    angle(){
      return atan2(this.im, this.re)
    }

    clone(){
      return new Complex(this.re, this.im)
    }
    
    conjugate(){
      return new Complex(this.re, -this.im)
    }

    print(){
      console.log("a: %f    b: %f", this.re, this.im)
    }
    
  }

function fromAngle(angle, radius){
  let c = new Complex(cos(angle), sin(angle))
  c.scale(radius)
  return c
}


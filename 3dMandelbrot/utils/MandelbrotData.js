
class MandelbrotData{

    constructor(w, h, c, step, power){
        this.w = w;
        this.h = h;
        this.center = c;
        this.step = step;
        this.power = power;
        this.data = new Array(w).fill().map(() => new Float32Array(h).fill(0))
        this.log2 = log(2)
    }

    getValueAt(x, y){
        return this.data[x][y];
    }
      
    setValueAt(x, y, v){
        this.data[x][y] = v;
    }

    toComplex(x, y){
        let c = new Complex((x - this.w/2) * this.step, (y - this.h/2) * this.step)
        c.add(this.center);
        return c;
    }
      
    toPoint(c){
        c.subtract(this.center)
        return (c.a / unitsPerPixel, c.b / unitsPerPixel)
    }

    fillAllData(maxIt){
        let power_func = power_funtion(this.power)
        for(let i = 0 ; i < this.w ; i++)
            for(let j = 0 ; j < this.h ; j++)
                this.fillDataAt(i, j, maxIt, power_func)
    }

    fillDataAt(x, y, maxIt, power_func, debug){

        let c = this.toComplex(x, y)
        let z = new Complex(0, 0);
        let i = 0

        for(; i < maxIt ; i++){
            z = power_func(z)
            z.add(c);
            if(z.lengthSquared() > 100)
                break;
        }
        if(i == maxIt){
            this.setValueAt(x, y, 1)
            return
        }
            
        z.square();
        z.add(c);
        z.square();
        z.add(c);

        let val = (i + 1 - log(log(z.lengthSquared()))/this.log2) / maxIt

        this.setValueAt(x, y, val < 0 ? 0 : val)
    
    }

    moveXAndFill(dir, maxIt){
        this.center.re += this.step * dir;
        let power_func = power_funtion(this.power)
        if(dir > 0){

            for(let i = dir; i < this.w ; i++)
                for(let j = 0 ; j < this.h ; j++)
                    this.setValueAt(i-dir, j, this.getValueAt(i, j));
            
            for(let i = 0 ; i < this.h ; i++)
                for(let j = 0 ; j < dir ; j++)
                    this.fillDataAt(this.w - 1 - j, i, maxIt, power_func, true)
            
                
        }else{
            dir *= -1
            for(let i = this.w - dir - 1 ; i >= 0 ; i--)
                for(let j = 0 ; j < this.h ; j++)
                    this.setValueAt(i+dir, j, this.getValueAt(i, j));

            for(let i = 0 ; i < this.h ; i++)
                for(let j = 0 ; j < dir ; j++)
                    this.fillDataAt(j, i, maxIt, power_func)
        }
    }

    moveYAndFill(dir, maxIt){
        this.center.im += this.step * dir;
        let power_func = power_funtion(this.power)
        if(dir > 0){
            for(let i = dir ; i < this.h ; i++)
                for(let j = 0 ; j < this.w ; j++)
                    this.setValueAt(j, i-dir, this.getValueAt(j, i));

            for(let i = 0 ; i < this.w ; i++)
                for(let j = 0 ; j < dir ; j++)
                    this.fillDataAt(i, this.h - 1 - j, maxIt, power_func)
        }else{
            dir *= -1
            for(let i = this.h - dir - 1 ; i >= 0 ; i--)
                for(let j = 0 ; j < this.w ; j++)
                    this.setValueAt(j, i+dir, this.getValueAt(j, i));

            for(let i = 0 ; i < this.w ; i++)
                for(let j = 0 ; j < dir ; j++)
                    this.fillDataAt(i, j, maxIt, power_func)
        }
    }

    toImage(gradient){
        let img = createImage(this.w, this.h)
        img.loadPixels()
        for (let i = 0; i < img.width; i++) {
            for (let j = 0; j < img.height; j++) {
                let val = this.getValueAt(i, j);
                if(val === 1)
                    img.set(i, j, color('black'))
                else
                    img.set(i, j, gradient(this.getValueAt(i, j)))
            }
        }
        img.updatePixels()
        return img
    }
}

function power_funtion(c){
    if(c.im != 0)
        return (z) => z.complex_power(c)
    if(c.re < 1 || c.re != floor(c.re))
        return (z) => z.real_power(c.re)
    if(c.re != 2)
        return (z) => z.int_power(c.re)
    return (z) => z.squared()
}
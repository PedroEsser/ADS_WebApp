let sliderRE
let sliderIM
let textRE
let textIM

function setupSliders(){
    createElement("a", " Re:")
    textRE = createInput(2)
    textRE.changed(() => {
        fillData()
    })
    sliderRE = createSlider(0, 10, 2, 0.001)
    sliderRE.style("width:800px")
    sliderRE.input(() =>{
        textRE.value(sliderRE.value())
        fillData()
    })
    createP()
    createElement("a", " Im:")
    textIM = createInput(0)
    textIM.changed(() => fillData())
    sliderIM = createSlider(-2, 2, 0, 0.001)
    sliderIM.style("width:800px")
    sliderIM.input(() =>{
        textIM.value(sliderIM.value())
        fillData()
    })
    createP()
    createInputs()
}

function createInputs(){
    createElement("a", " Width:")
    let widthInput = createInput(w)
    widthInput.changed((e) => {
        setDimensions(widthInput.value(), h, scale)
        console.log(e)
        //fillData()
    })

    createElement("a", " Height:")
    let heightInput = createInput(h)
    heightInput.changed((e) => {
        console.log(e)
        //h = heightInput.value()
        //fillData()
    })
}
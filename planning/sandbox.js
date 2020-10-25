// const testing = ({alfons, bertil, claes = null}) => {
//     console.log(bertil)
// }

// const obj = getObjFromAPI()

// const bertil = 'Bertil'

// testing({bertil, alfons: 'Åberg'})

let m1
let m2


let newCodes = function() {  
    const dCodes = "code1"
    const dCodes2 = "code2"
    return [dCodes, dCodes2]
};

[m1, m2] = newCodes()

//console.log(dCodes, dCodes2)  //TODO this is interessting
console.log(m1,m2)
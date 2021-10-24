// const validEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// console.log(validEmailRegex.test("scasdasdasdasdasdasd@Yahoo.com"))


// code wars function
Array.prototype.ofType = function (type) {
    return this.filter(e => {
        if (e.type === type.name) {
            return type.name;
            // console.log(e.type)
            // console.log(type)
        }
        
        // console.log()
    })
}

// check this out //
// function whatsup(greetings, name) {
//   return `${greetings} ${name}`;
// }
// console.log(whatsup(whatsup.name, 'john'));

function Human() { this.type = 'Human';  }
function Teacher() { this.type = 'Teacher' };

Teacher.prototype = new Human();
Teacher.prototype.constructor = Teacher;

var teacher = new Teacher();
var human = new Human();
let arrOne = [teacher, human];

let arr = [{a: 5, b: 5}, false, [], e=>e, human, teacher ];

//
console.log(arr.ofType(Human));





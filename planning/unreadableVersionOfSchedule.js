const lessons = [
    {start:510, stop:630, name:"Mafs", room:"Varvsholmen", mClass:"nate19a", day:0},
    {start:730, stop:920, name:"Teknik2", room:"Stensö", mClass:"nate18a", day:0},
    {start:510, stop:630, name:"Teknik1", room:"Varvsholmen", mClass:"nate19a", day:1},
    {start:680, stop:830, name:"Mafs", room:"Varvsholmen", mClass:"nate19a", day:1},
    {start:510, stop:630, name:"Teknik5", room:"Varvsholmen", mClass:"nate19a", day:2},
    {start:750, stop:830, name:"Tyska", room:"Varvsholmen", mClass:"nate19a", day:2},
    {start:540, stop:630, name:"Teknik1", room:"Varvsholmen", mClass:"nate19a", day:4},
    {start:680, stop:1080, name:"Mafs", room:"Varvsholmen", mClass:"nate19a", day:4}
]

const schedule_container = document.getElementById("schedule_table");
const day_btns_div = document.getElementById("day_btn_holder");
const rowHeight = 70
const lastAllowedShoolHour = 18
const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"]

var startI = 0

function showDay(day){
    if(day < 0 || day > 4){
        console.log("Not a businessday: " + day)
        day = 0
    }

    displayDay(day)
    populate_schedule(day)
}


function displayDay(day){

    const curDay = new Date()
    const dayDsply = document.getElementById("day_display").innerHTML = days[day];
    selectWeekDayDiv.children[day].click()
}

//add times to schedule
function populate_schedule(day){
    let lastSpan = 1
    let lessonI = 0

    schedule_container.innerHTML = ""

    //finds which lesson object to start at
    while (lessons[lessonI].day != day){
        lessonI ++
        if(lessonI >= lessons.length){
            schedule_container.innerHTML += "<h4 class='empty_schedule'>Inga lektioner denna dag</h4>"
            schedule_container.style.gridTemplateRows = `${rowHeight}px`
            return
        }
    }   
    let i = Math.floor(lessons[lessonI].start/60)
    startI = i


    while(true){
        //                                  no more lessons            no more lessons that day      not cutting of in middle of a lesson
        if(i > schoolCloseTime || ((lessonI >= lessons.length || lessons[lessonI].day != day) && lastSpan == 1)){
            break
        }
        
        //number
        schedule_container.innerHTML += `<div class='time_column'>
                                            <h4>${i}:00</h4></div>`

        //so no blank elements on top of lessons
        if(lastSpan != 1){
            lastSpan --
            i++
            continue
        }

        const lesson = lessons[lessonI]
        const startHour = Math.floor(lesson.start/60)

        if(startHour == i){
            const startMin = lesson.start % 60
            const startMargin = (startMin / 60) * rowHeight

            const stopHour = Math.ceil(lesson.stop/60)
            const stopMin = lesson.stop % 60
            const stopMargin = ((60-stopMin) / 60) * rowHeight

            lastSpan = stopHour-startHour

            schedule_container.innerHTML += `
                <div class="schedule_item" style="grid-row-end: span ${lastSpan}; height:${rowHeight*lastSpan - startMargin - stopMargin}px; top:${startMargin}px;">
                    <h4>${lesson.name}</h4>
                    <p>${lesson.room}</p>
                    <p>${lesson.mClass}</p>
                    <p>${startHour}:${addLeadingZero(startMin)}-${stopHour - 1}:${addLeadingZero(stopMin)}</p>
                </div>`

            lessonI++
        } else {
            schedule_container.innerHTML += `<div class="schedule_divider"></div>`
        }

        i++
    }

    schedule_container.style.gridTemplateRows = `repeat(${i - startI}, ${rowHeight}px)`
}

function addLeadingZero(num){
    return String(num).padStart(2, '0')
}

showDay(new Date().getDay() - 1)
document.querySelector('#counter').innerText = ''

let commonInterval = setInterval(start, 10000)
start()

let notifications = [390000, 395000, 400000, 405000, 410000, 415000, 420000, 425000, 430000, 435000, 440000, 445000, 450000, 455000, 460000, 465000, 470000, 475000, 480000, 485000, 490000, 495000, 500000]
let notified_about = []

function start() {
  const url = 'http://localhost:54229/api/v1/maps/counters/?cacheProtection='+Date.now()
  fetch(url).then(response => response.json()).then(js => personUpdate(js))
}

function personUpdate(js){
  changeCounter(document.querySelector('#counter'), js.persons)

  let lastDigit = js.persons%10
  if(lastDigit >= 2 && lastDigit <= 4) {
    document.querySelector('#personslabel').innerText = 'ЧЕЛОВЕКА УЧАСТВУЕТ'
  } else {
    document.querySelector('#personslabel').innerText = 'ЧЕЛОВЕК УЧАСТВУЕТ'
  }

  if(js.persons >= 500000) {
    document.body.classList.add('celebration')
  }

  let notification_number = notifications.filter(i => (js.persons-i < 5000) && (js.persons-i > 0))[0]
  if(!notified_about.includes(notification_number)){
    const notification = "https://api.telegram.org/bot1453311877:AAEkFmrjhuhOmoAfJOJome33ni93ExlLgpI/sendMessage?chat_id=270882543&text={KS}%20%D1%83%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B0%D0%BA%D1%86%D0%B8%D0%B8%21&reply_markup=%7B%22inline_keyboard%22%3A%5B%5B%7B%22text%22%3A%22%D0%9F%D0%B5%D1%80%D0%B5%D0%B9%D1%82%D0%B8%20%D0%BD%D0%B0%20Youtube%22%2C%22url%22%3A%22https%3A%2F%2Fyoutu.be%2FOZzklIlp8XI%22%7D%5D%5D%7D"
    fetch(notification.replace("{KS}", encodeURI(beautify_number(notification_number))))
    notified_about.push(notification_number)
  }
}

function beautify_number(n){
  let s = String(n)
  return s.slice(0,3)+' '+s.slice(3,7)
}

function changeCounter(counterDOM, new_number, debug = false){
  let current_string_value = counter.innerText
  new_number = String(new_number)
  if(current_string_value.length !== new_number.length){ counterDOM.innerText = new_number; return; }
  let new_value = current_string_value.split('').reduce((prev, cur, i) => {
    if(prev !== ''){
      return prev+new_number[i]
    } else {
      if(cur !== new_number[i]){
        return new_number[i]
      } else {
        return ''
      }
    }
  }, '')
  if(new_value == ''){ return; }
  let current_value = Number(current_string_value)
  let increment = Number(new_number) > current_value
  let counterWidth = counterDOM.offsetWidth
  let counterHeight = counterDOM.offsetHeight

  counterDOM.classList.add('fixed')
  counterDOM.style.width = counterWidth + 'px'
  counterDOM.style.height = counterHeight + 'px'

  counterDOM.innerHTML = ''
  let digits_current_value = [...current_value+'']
  let current_value_span = Array(digits_current_value.length).fill()
  digits_current_value.forEach((digit, i) => {
    current_value_span[i] = document.createElement('span')
    current_value_span[i].innerText = digit
    counterDOM.append(current_value_span[i])
    let leftOffset = current_value_span[i].offsetLeft
    setTimeout(() => {
      current_value_span[i].classList.add('positioned')
      current_value_span[i].style.marginLeft = leftOffset+'px'
    }, 1)
  })

  let digits_new_value = [...new_value+''].reverse()
  let new_value_span = Array(digits_new_value.length).fill()
  digits_new_value.forEach((digit, i) => {
    new_value_span[i] = document.createElement('span')
    new_value_span[i].className = "positioned new_value "+(increment?"from_top":"from_bottom")
    new_value_span[i].innerText = digit
    counterDOM.append(new_value_span[i])
    setTimeout(() => {
      new_value_span[i].style.marginLeft = current_value_span[current_value_span.length - 1 - i].style.marginLeft
    }, 1)
  })

  setTimeout(() => {
    new_value_span.forEach((span, i) => {
      let _class = (increment?"to_bottom":"to_top")
      setTimeout(() => {
        span.classList.add(_class)
      }, 100)
      current_value_span[current_value_span.length - 1 - i].classList.add(_class)
    })
  }, 1)

  if(debug){
    setTimeout(() => {
      debugger;
    }, 15)
  }

  setTimeout(() => {
    let remainPart = current_string_value.slice(0, digits_current_value.length - digits_new_value.length)
    let newPart = digits_new_value.reverse()
    counterDOM.innerHTML = remainPart + newPart.join('')
    counterDOM.classList.remove('fixed')
    counterDOM.style.width = ""
    counterDOM.style.height = ""
  }, 550)
}
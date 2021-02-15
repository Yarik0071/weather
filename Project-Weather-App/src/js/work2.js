import fetchForeCust from '../api/forecast.js';
import templateLi from '../templates/hbs-li.hbs';

const refs = {
  CCName: document.querySelector('.cityName'),
  input: document.querySelector('.main-input'),
  modal: document.querySelector('.list-modal'),
  days: document.querySelector('.list--days'),
  modalLink: document.querySelectorAll('.more-info'),
};

let dataList = [];

export default function buildPostFeed(data) {
  dataList = data.list;

  let arrDays = {};

  const cityName = `${data.city.name}, ${data.city.country}`;

  refs.CCName.textContent = cityName;

  data.list.forEach(value => {

    let dt = new Date(value.dt * 1000);

    refs.days.textContent = '';

    if (dt.getDay() !== new Date().getDay() || true) {
      let day = dt.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      
      if (arrDays[day] === undefined) {
        arrDays[day] = {
          name: day,
          date: `${dt.getDate()} ${dt.toLocaleDateString('en-US', {
            month: 'short',
          })}`,
          icon: `http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`,
          min: value.main.temp_min.toFixed(0),
          max: value.main.temp_max.toFixed(0),
        };
      } else {
        arrDays[day].min =
          arrDays[day].min > value.main.temp_min
            ? value.main.temp_min.toFixed(0)
            : arrDays[day].min;
        arrDays[day].max =
          arrDays[day].max < value.main.temp_max
            ? value.main.temp_max.toFixed(0)
            : arrDays[day].max;
      }
    }
  });
  for (let value in arrDays) {
    refs.days.insertAdjacentHTML('beforeend', templateLi(arrDays[value]));
  }
}

const reverseGeocoder = new BDCReverseGeocode();
const debounce = require('lodash.debounce');

let isActive = false;

function loadDefaultRender() {
  reverseGeocoder.getClientLocation(function (result) {
    fetchForeCust(result.localityInfo.administrative[1].name).then(data => {
      buildPostFeed(data);
    });
  });
}

function searchFromInput(e) {
  isActive = true;
  fetchForeCust(e.target.value).then(data => {
    buildPostFeed(data);

    let temp = [
      `${data.list[1].main.temp}`,
      `${data.list[2].main.temp}`,
      `${data.list[3].main.temp}`,
      `${data.list[4].main.temp}`,
      `${data.list[5].main.temp}`,
    ];
    let humidity = [
      `${data.list[1].main.humidity}`,
      `${data.list[2].main.humidity}`,
      `${data.list[3].main.humidity}`,
      `${data.list[4].main.humidity}`,
      `${data.list[5].main.humidity}`,
    ];
    let wind = [
      `${data.list[1].wind.speed}`,
      `${data.list[2].wind.speed}`,
      `${data.list[3].wind.speed}`,
      `${data.list[4].wind.speed}`,
      `${data.list[5].wind.speed}`,
    ];
    let pressure = [
      `${data.list[1].main.pressure}`,
      `${data.list[2].main.pressure}`,
      `${data.list[3].main.pressure}`,
      `${data.list[4].main.pressure}`,
      `${data.list[5].main.pressure}`,
    ];
    let dates = [
      `${data.list[1].dt_txt}`,
      `${data.list[2].dt_txt}`,
      `${data.list[3].dt_txt}`,
      `${data.list[4].dt_txt}`,
      `${data.list[5].dt_txt}`,
    ];
  });
}

if (!isActive) {
  loadDefaultRender();
} else {
  searchFromInput();
}

refs.input.addEventListener('input', debounce(searchFromInput, 1000));

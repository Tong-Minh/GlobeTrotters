import Service from '@ember/service';
import { service } from '@ember/service';
import { achievements, achievementNums } from '../data/achievements.js';

export default class HelpersService extends Service {
  @service firebase;

  getImageLink(country, state) {
    if (country === 'United States' && state !== '') {
      return `/images/states/${this.getStateAbbreviation(state)}/1024.png`;
    } else {
      return `/images/countries/${this.getCountryAbbreviation(country)}/1024.png`;
    }
  }

  getStateAbbreviation(state) {
    const states = {
      Alabama: 'AL',
      Alaska: 'AK',
      Arizona: 'AZ',
      Arkansas: 'AR',
      California: 'CA',
      Colorado: 'CO',
      Connecticut: 'CT',
      Delaware: 'DE',
      Florida: 'FL',
      Georgia: 'GA',
      Hawaii: 'HI',
      Idaho: 'ID',
      Illinois: 'IL',
      Indiana: 'IN',
      Iowa: 'IA',
      Kansas: 'KS',
      Kentucky: 'KY',
      Louisiana: 'LA',
      Maine: 'ME',
      Maryland: 'MD',
      Massachusetts: 'MA',
      Michigan: 'MI',
      Minnesota: 'MN',
      Mississippi: 'MS',
      Missouri: 'MO',
      Montana: 'MT',
      Nebraska: 'NE',
      Nevada: 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      Ohio: 'OH',
      Oklahoma: 'OK',
      Oregon: 'OR',
      Pennsylvania: 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      Tennessee: 'TN',
      Texas: 'TX',
      Utah: 'UT',
      Vermont: 'VT',
      Virginia: 'VA',
      Washington: 'WA',
      'West Virginia': 'WV',
      Wisconsin: 'WI',
      Wyoming: 'WY',
    };

    const abbreviation = states[state];
    return abbreviation ? abbreviation.toLowerCase() : null;
  }

  getCountryAbbreviation(country) {
    const countries = {
      Afghanistan: 'AF',
      Albania: 'AL',
      Algeria: 'DZ',
      Andorra: 'AD',
      Angola: 'AO',
      Antarctica: 'AQ',
      Argentina: 'AR',
      Armenia: 'AM',
      Australia: 'AU',
      Austria: 'AT',
      Azerbaijan: 'AZ',
      Bahamas: 'BS',
      Bahrain: 'BH',
      Bangladesh: 'BD',
      Barbados: 'BB',
      Belarus: 'BY',
      Belgium: 'BE',
      Belize: 'BZ',
      Benin: 'BJ',
      Bhutan: 'BT',
      Bolivia: 'BO',
      'Bosnia and Herzegovina': 'BA',
      Botswana: 'BW',
      Brazil: 'BR',
      Brunei: 'BN',
      Bulgaria: 'BG',
      'Burkina Faso': 'BF',
      Burundi: 'BI',
      Cambodia: 'KH',
      Cameroon: 'CM',
      Canada: 'CA',
      'Cape Verde': 'CV',
      'Central African Republic': 'CF',
      Chad: 'TD',
      Chile: 'CL',
      China: 'CN',
      Colombia: 'CO',
      Comoros: 'KM',
      Congo: 'CG',
      'Costa Rica': 'CR',
      Croatia: 'HR',
      Cuba: 'CU',
      Cyprus: 'CY',
      'Czech Republic': 'CZ',
      Denmark: 'DK',
      Djibouti: 'DJ',
      Dominica: 'DM',
      'Dominican Republic': 'DO',
      Ecuador: 'EC',
      Egypt: 'EG',
      'El Salvador': 'SV',
      'Equatorial Guinea': 'GQ',
      Eritrea: 'ER',
      Estonia: 'EE',
      Eswatini: 'SZ',
      Ethiopia: 'ET',
      Fiji: 'FJ',
      Finland: 'FI',
      France: 'FR',
      Gabon: 'GA',
      Gambia: 'GM',
      Georgia: 'GE',
      Germany: 'DE',
      Ghana: 'GH',
      Greece: 'GR',
      Grenada: 'GD',
      Guatemala: 'GT',
      Guinea: 'GN',
      'Guinea-Bissau': 'GW',
      Guyana: 'GY',
      Haiti: 'HT',
      Honduras: 'HN',
      Hungary: 'HU',
      Iceland: 'IS',
      India: 'IN',
      Indonesia: 'ID',
      Iran: 'IR',
      Iraq: 'IQ',
      Ireland: 'IE',
      Israel: 'IL',
      Italy: 'IT',
      Jamaica: 'JM',
      Japan: 'JP',
      Jordan: 'JO',
      Kazakhstan: 'KZ',
      Kenya: 'KE',
      Kiribati: 'KI',
      Kuwait: 'KW',
      Kyrgyzstan: 'KG',
      Laos: 'LA',
      Latvia: 'LV',
      Lebanon: 'LB',
      Lesotho: 'LS',
      Liberia: 'LR',
      Libya: 'LY',
      Liechtenstein: 'LI',
      Lithuania: 'LT',
      Luxembourg: 'LU',
      Madagascar: 'MG',
      Malawi: 'MW',
      Malaysia: 'MY',
      Maldives: 'MV',
      Mali: 'ML',
      Malta: 'MT',
      Mauritania: 'MR',
      Mauritius: 'MU',
      Mexico: 'MX',
      Micronesia: 'FM',
      Moldova: 'MD',
      Monaco: 'MC',
      Mongolia: 'MN',
      Montenegro: 'ME',
      Morocco: 'MA',
      Mozambique: 'MZ',
      Myanmar: 'MM',
      Namibia: 'NA',
      Nauru: 'NR',
      Nepal: 'NP',
      Netherlands: 'NL',
      'New Zealand': 'NZ',
      Nicaragua: 'NI',
      Niger: 'NE',
      Nigeria: 'NG',
      'North Korea': 'KP',
      'North Macedonia': 'MK',
      Norway: 'NO',
      Oman: 'OM',
      Pakistan: 'PK',
      Palau: 'PW',
      Palestine: 'PS',
      Panama: 'PA',
      'Papua New Guinea': 'PG',
      Paraguay: 'PY',
      Peru: 'PE',
      Philippines: 'PH',
      Poland: 'PL',
      Portugal: 'PT',
      Qatar: 'QA',
      Romania: 'RO',
      Russia: 'RU',
      Rwanda: 'RW',
      'Saint Kitts and Nevis': 'KN',
      'Saint Lucia': 'LC',
      'Saint Vincent and the Grenadines': 'VC',
      Samoa: 'WS',
      'San Marino': 'SM',
      'Sao Tome and Principe': 'ST',
      'Saudi Arabia': 'SA',
      Senegal: 'SN',
      Serbia: 'RS',
      Seychelles: 'SC',
      'Sierra Leone': 'SL',
      Singapore: 'SG',
      Slovakia: 'SK',
      Slovenia: 'SI',
      'Solomon Islands': 'SB',
      Somalia: 'SO',
      'South Africa': 'ZA',
      'South Korea': 'KR',
      Spain: 'ES',
      'Sri Lanka': 'LK',
      Sudan: 'SD',
      Suriname: 'SR',
      Sweden: 'SE',
      Switzerland: 'CH',
      Syria: 'SY',
      Tajikistan: 'TJ',
      Tanzania: 'TZ',
      Thailand: 'TH',
      'Timor-Leste': 'TL',
      Togo: 'TG',
      Tonga: 'TO',
      'Trinidad and Tobago': 'TT',
      Tunisia: 'TN',
      Turkey: 'TR',
      Turkmenistan: 'TM',
      Tuvalu: 'TV',
      Uganda: 'UG',
      Ukraine: 'UA',
      'United Arab Emirates': 'AE',
      'United Kingdom': 'GB',
      'United States': 'US',
      Uruguay: 'UY',
      Uzbekistan: 'UZ',
      Vanuatu: 'VU',
      'Vatican City': 'VA',
      Venezuela: 'VE',
      Vietnam: 'VN',
      Yemen: 'YE',
      Zambia: 'ZM',
      Zimbabwe: 'ZW',
    };

    const abbreviation = countries[country];
    return abbreviation ? abbreviation.toLowerCase() : null;
  }

  async validateAchieve() {
    console.log('validating');

    var newNum = await this.firebase.getVisits();

    console.log(newNum);
    if (achievementNums.includes(newNum)) {
      console.log('validated');
      var name;
      var requirement;
      var reqNum;

      achievements.forEach((achievement) => {
        if (achievement.reqNum == newNum) {
          name = achievement.name;
          requirement = achievement.requirement;
          reqNum = achievement.reqNum;
        }
      });

      const nameElement = document.getElementById('name');
      const requirementElement = document.getElementById('requirement');
      const reqNumElement = document.getElementById('reqNum');
      const containerElement = document.getElementById('achievement-container');

      nameElement.textContent = '"' + name + '"';
      requirementElement.textContent = requirement;
      reqNumElement.textContent = reqNum;
      containerElement.classList.remove('hidden');

      document.body.classList.add('overflow-hidden');
    }
  }
}

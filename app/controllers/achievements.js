import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AchievementsController extends Controller {
  @action
  achieveInfo(num) {
    var img = 'class-' + num + '-img';
    var info = 'class-' + num + '-info';
    const imgClasses = document.getElementsByClassName(img);
    const infoClasses = document.getElementsByClassName(info);

    //A little messy and repetative, but works as a toggle for when achievements are clicked
    if (imgClasses[0].classList.contains('hidden')) {
      imgClasses[0].classList.remove('hidden');
      imgClasses[1].classList.remove('hidden');
      imgClasses[2].classList.remove('hidden');

      infoClasses[0].classList.add('hidden');
      infoClasses[1].classList.add('hidden');
      infoClasses[2].classList.add('hidden');
    } else {
      imgClasses[0].classList.add('hidden');
      imgClasses[1].classList.add('hidden');
      imgClasses[2].classList.add('hidden');

      infoClasses[0].classList.remove('hidden');
      infoClasses[1].classList.remove('hidden');
      infoClasses[2].classList.remove('hidden');
    }
  }
}

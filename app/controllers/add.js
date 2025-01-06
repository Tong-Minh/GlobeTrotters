import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AddController extends Controller {
  @service firebase;
  @service router;
  @service helpers;

  @tracked tags = [];
  @tracked people = [];
  @tracked pictures = [];
  @tracked dateOrder = true;
  @tracked startOrder = '';
  @tracked endOrder = '';
  @tracked duplicatePeople = [];
  @tracked targetName = '';
  @action
  checkDates(input, event) {
    if (input === 'startDate') {
      this.startOrder = event.target.value;
    } else if (input === 'endDate') {
      this.endOrder = event.target.value;
    }
    if (this.startOrder && this.endOrder) {
      let start = new Date(this.startOrder);
      let end = new Date(this.endOrder);
      if (start > end) {
        this.dateOrder = false;
      } else {
        this.dateOrder = true;
      }
    }
  }
  @action addTag() {
    const tag = document.getElementById('tagField').value;
    if (tag != '') {
      document.getElementById('tagField').value = '';
      this.tags = [...this.tags, tag];
    }
  }

  @action
  async addPerson() {
    const person = document.getElementById('peopleField').value;
    if (person != '') {
      document.getElementById('peopleField').value = '';

      await this.firebase.getAllPeopleUser();

      let checkPerson = this.firebase.userPeople.filter(
        (i) => i.name === person,
      );
      this.targetName = person;
      console.log(checkPerson);
      if (checkPerson.length < 1) {
        await this.firebase.addNewPersonName(person);
        await this.firebase.getAllPeopleUser();
        let newPerson = this.firebase.userPeople.find((i) => i.name === person);
        this.people = [...this.people, newPerson];
      } else {
        this.duplicatePeople = checkPerson;
      }
    }
  }

  @action
  addPersonFromDuplicates(person) {
    this.people = [...this.people, person];
    this.targetName = '';
    this.duplicatePeople = [];
  }

  @action
  async createPerson() {
    await this.firebase.addNewPersonName(this.targetName);
    await this.firebase.getAllPeopleUser();
    let newPerson = this.firebase.userPeople.find(
      (i) => i.name === this.targetName,
    );
    this.people = [...this.people, newPerson];
    this.targetName = '';
    this.duplicatePeople = [];
  }

  @action
  deleteTag(id, tag) {
    let tagstr = `tag-${id}`;
    const tagDivSpecific = document.getElementById(tagstr);
    const tagDivList = document.getElementById('tagdiv');
    tagDivList.removeChild(tagDivSpecific);
    // no idea this existed (filter)
    //https://stackoverflow.com/questions/48608119/javascript-remove-all-occurrences-of-a-value-from-an-array
    this.tags = this.tags.filter((i) => i !== tag);
  }

  @action deletePerson(id, person) {
    let personstr = `person-${id}`;
    const personDivSpecific = document.getElementById(personstr);
    const personDivList = document.getElementById('peoplediv');
    personDivList.removeChild(personDivSpecific);
    // no idea this existed (filter)
    //https://stackoverflow.com/questions/48608119/javascript-remove-all-occurrences-of-a-value-from-an-array
    this.people = this.people.filter((i) => i !== person);
  }

  @action updatePics(event) {
    this.pictures = Array.from(event.target.files);
    const preview = document.getElementById('photo-preview');
    preview.className = 'gap-2 flex-wrap';

    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    if (this.pictures.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
      for (const file of this.pictures) {
        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        image.alt = image.title = file.name;
        image.className = 'h-20 w-30 rounded';
        preview.appendChild(image);
      }
    }
  }

  @action
  async addTrip(location, event) {
    event.preventDefault();
    if (this.checkDates) {
      console.log(location);
      const title = document.getElementById('titleField').value;
      const description = document.getElementById('descriptionField').value;
      const start = document.getElementById('startField').value;
      const end = document.getElementById('endField').value;
      const tags = this.tags;
      const people = this.people;
      let state = '';
      let inUSA = this.helpers.getStateAbbreviation(location);

      if (inUSA) {
        state = location;
        location = 'United States';
      }

      try {
        await this.firebase.addTrip(
          title,
          description,
          location,
          state,
          start,
          end,
          tags,
          people,
          this.pictures,
        );
        this.tags = [];
        this.people = [];
        this.pictures = [];
        this.dateOrder = true;
        this.startOrder = '';
        this.endOrder = '';
        this.duplicatePeople = [];
        this.targetName = '';
        await this.router.transitionTo('visited');
        this.helpers.validateAchieve();
      } catch (error) {
        console.error('Error adding trip: ', error);
        this.router.transitionTo('add-failure');
      }
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.tags = [];
    controller.people = [];
    controller.pictures = [];
    controller.dateOrder = true;
    controller.startOrder = '';
    controller.endOrder = '';
    controller.duplicatePeople = [];
    controller.targetName = '';
  }
}

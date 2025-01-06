import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { underscore } from '@ember/string';
import { none } from '@ember/object/computed';

export default class TripController extends Controller {
  @tracked trip;
  @tracked editing = false;
  @tracked addingTag = false;
  @tracked addingPeople = false;
  @tracked editTags;
  @tracked editPeople;
  @tracked allPeople;
  @tracked otherPeople = [];
  @tracked renderedAddedPhotos = [];
  @tracked addedPhotos = [];
  @tracked editPhotos = [];
  @tracked addingProfilePicture = false;
  @tracked addedPFP = false;
  @tracked profilePic = '/images/profile.svg';
  @tracked addedProfile = {
    name: '',
    pic: {
      id: '',
      link: '',
    },
  };
  removedPhotos = [];

  @service firebase;
  @service router;
  //===========================================================================
  // Edit mode state management
  //===========================================================================

  @action
  toggleEdit() {
    this.editing = !this.editing;
  }

  @action
  cancelEdit() {
    this.editTags = this.trip.tags;
    this.editPeople = this.trip.people;
    this.editPhotos = this.trip.photos;
    this.addedPhotos = [];
    this.renderedAddedPhotos = [];
    this.removedPhotos = [];
    this.addingProfilePicture = false;
    this.addingPeople = false;
    this.toggleEdit();
    this.router.refresh();
  }

  //===========================================================================
  // Add and remove tags in Edit mode
  //===========================================================================

  @action
  toggleAddTag() {
    this.addingTag = !this.addingTag;
  }

  @action
  addTag(event) {
    let input = event.target.parentElement.querySelector('#new-tag');
    let tag = input.value;
    if (tag === '' || tag === undefined || tag.length > 20) {
      return;
    }
    if (this.editTags.includes(tag)) {
      input.value = '';
      return;
    }
    this.editTags = [...this.editTags, tag];
    input.value = '';
    console.log('Tag:', tag);
  }

  @action
  removeTag(event) {
    let tag = event.target.parentElement
      .querySelector('.tag')
      .innerText.replace('#', '');
    this.editTags = this.editTags.filter((t) => t !== tag);
    console.log('Tags: ' + this.editTags);
  }

  //===========================================================================
  // Photo upload
  //===========================================================================

  @action
  addPhoto(event) {
    let photo = event.target.files[0];
    if (!photo) {
      return;
    }

    this.addedPhotos = [...this.addedPhotos, photo];

    let reader = new FileReader();
    reader.onload = (e) => {
      this.renderedAddedPhotos = [...this.renderedAddedPhotos, e.target.result];

      console.log('Photos:', this.renderedAddedPhotos);
    };
    reader.readAsDataURL(photo);
  }

  @action
  togglePhotoEdit(event) {
    if (!this.editing) {
      return;
    }
    if (event.target.parentElement.querySelector('.remove')) {
      return;
    }
    let remove = document.createElement('div');
    remove.classList.add('remove');
    remove.innerHTML = `
      <div class="flex flex-col items-center gap-4 border-2 border-black rounded-md bg-white p-4">
        <div class="text-center">Delete Photo?</div>
        <div class="flex gap-2 items-center *:select-none">
          <button type='button' class="hover:text-red-600 yes">Yes</button>
          <button type='button' class="hover:text-sky-600 no">No</button>
        </div>
      </div>
    `;
    event.target.parentElement.appendChild(remove);

    let yes = remove.querySelector('.yes');
    let no = remove.querySelector('.no');

    yes.addEventListener('click', this.deletePhoto);
    no.addEventListener('click', this.cancelPhoto);
  }

  @action
  deletePhoto(event) {
    //This is really silly, but closest is not helping me here ahh
    let image =
      event.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        'img',
      );
    let photo = image.id;
    console.log('Photo:', photo);
    this.editPhotos = this.editPhotos.filter((p) => p.link !== photo);
    this.renderedAddedPhotos = this.renderedAddedPhotos.filter(
      (p) => p !== photo,
    );
    if (!this.removedPhotos.includes(photo)) {
      this.removedPhotos.push(photo);
    }
    console.log('Photos:', this.renderedAddedPhotos);
    console.log('Removed Photos:', this.removedPhotos);
    console.log('Added Photos:', this.addedPhotos);
    let imageParent = image.parentElement;
    imageParent.remove(image);
  }

  @action
  cancelPhoto(event) {
    console.log('Cancel Photo');
    event.target.closest('.remove').remove();
  }

  //===========================================================================
  // Add and remove people in Edit mode
  //===========================================================================

  @action
  toggleAddPeople() {
    if (!this.addingPeople) {
      console.log('All People: ', this.allPeople);
      console.log('Edit People: ', this.editPeople);
      this.otherPeople = this.allPeople
        .filter(
          (person) =>
            !this.editPeople.some((someone) => someone.docID === person.docID),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    console.log('Other People: ', this.otherPeople);
    this.addingPeople = !this.addingPeople;
  }

  @action
  async addPerson(event) {
    let input = event.target.parentElement.querySelector('#new-person');
    let person = input.value;
    let newPerson;
    if (person === '' || person === undefined || person.length > 20) {
      input.setCustomValidity('Invalid Name');
      console.log('Invalid Name');
      return;
    }
    let personID = await this.firebase.addNewPersonName(person);
    newPerson = await this.firebase.getSpecificPerson(personID);
    this.editPeople = [...this.editPeople, newPerson];
    this.ptherPeople = this.otherPeople
      .filter((p) => p.docID !== newPerson.docID)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.filterPeople();
    input.value = '';

    console.log('Person:', person);
    console.log('People:', this.editPeople);
  }

  @action
  addOtherPerson(docID, event) {
    this.editPeople = [
      ...this.editPeople,
      this.allPeople.find((p) => p.docID === docID),
    ];

    this.otherPeople = this.otherPeople
      .filter((p) => p.docID !== docID)
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log('People:', this.editPeople);
  }

  @action
  removePerson(profile, event) {
    this.editPeople = this.editPeople.filter((p) => p.docID !== profile.docID);

    this.otherPeople = [...this.otherPeople, profile].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    console.log('People: ' + this.editPeople);
  }

  @action
  filterPeople(event) {
    let query;
    if (!event) {
      query = '';
    } else {
      query = event.target.value;
    }
    this.otherPeople = this.allPeople
      .filter(
        (person) =>
          !this.editPeople.some((someone) => someone.docID === person.docID) &&
          person.name.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  //===========================================================================
  // Profile picture upload
  //===========================================================================

  @action
  toggleProfileImageSelector(profile, event) {
    this.addingProfilePicture = !this.addingProfilePicture;
    this.addedProfilePic = null;
    if (this.addingProfilePicture) {
      console.log('THIS SHOULD HAVE A DOCID:', profile);
      this.addedProfile = profile;

      if (profile.pic.id != undefined) {
        this.profilePic = profile.pic.link;
      } else {
        this.profilePic = '/images/profile.svg';
      }
    }
    console.log('Adding Profile Picture:', this.addingProfilePicture);
  }

  @action
  async setProfilePicture(event) {
    let photo = event.target.files[0];
    this.addedProfilePic = photo;
    this.profilePic = URL.createObjectURL(photo);
    this.addedPFP = true;
    console.log('Profile Picture:', this.profilePic);
  }

  @action
  async uploadProfilePicture() {
    try {
      console.log('Added Profile:', this.addedProfile);
      await this.firebase.updatePerson(
        this.addedProfile.docID,
        this.addedProfile.name,
        this.addedProfilePic,
      );
    } catch (e) {
      console.log('Error:', e);
    }

    const updatedPerson = await this.firebase.getSpecificPerson(
      this.addedProfile.docID,
    );
    this.editPeople = this.editPeople.map((person) =>
      person.docID === this.addedProfile.docID ? updatedPerson : person,
    );
    this.addedPFP = false;
    this.profilePic = '/images/profile.svg';
    this.addingProfilePicture = false;
  }

  //===========================================================================
  // Save and delete trip
  //================================================================

  @action
  async saveEdit() {
    let editTitle = document.getElementById('edit-title').value;
    let editStartDate = document.getElementById('edit-start').value;
    let editEndDate = document.getElementById('edit-end').value;
    let editDescription = document.getElementById('edit-description').value;

    console.log('Edit Title: ', editTitle);
    console.log('Edit Start Date: ', editStartDate);
    console.log('Edit End Date: ', editEndDate);
    console.log('Edit Description: ', editDescription);
    console.log('Edit Tags: ', this.editTags);
    console.log('Edit People: ', this.editPeople);
    console.log('Added Photos: ', this.addedPhotos);
    console.log('Removed Photos: ', this.removedPhotos);

    // Validation of input fields
    if (editTitle === '' || editTitle === undefined || editTitle.length > 20) {
      console.log('Invalid Title');
      document.getElementById('edit-title').setCustomValidity('Invalid Title');
      return;
    } else if (
      editDescription === '' ||
      editDescription === undefined ||
      editDescription.length > 1024
    ) {
      console.log('Invalid Description');
      document
        .getElementById('edit-description')
        .setCustomValidity('Invalid Description');
      return;
    } else if (editStartDate === '' || editStartDate === undefined) {
      console.log('Invalid Start Date');
      document
        .getElementById('edit-start')
        .setCustomValidity('Invalid Start Date');
      return;
    } else if (editEndDate === '' || editEndDate === undefined) {
      console.log('Invalid End Date');
      document.getElementById('edit-end').setCustomValidity('Invalid End Date');
      return;
    } else if (
      new Date(editStartDate).getTime() > new Date(editEndDate).getTime()
    ) {
      console.log('Invalid Date Range');
      document
        .getElementById('edit-end')
        .setCustomValidity('Invalid Date Range');
      return;
    }

    await this.firebase.updateTrip(
      this.trip.id,
      editTitle,
      editDescription,
      editStartDate,
      editEndDate,
      this.editTags,
      this.editPeople,
      this.removedPhotos,
      this.addedPhotos,
    );

    this.cancelEdit();
    // this.router.refresh();
  }

  spawnInvalidMessage(message, location) {
    location.classList.add(
      'border-red-500',
      'before:bg-red-500',
      'before:opacity-100',
      `before:content-['${message}']`,
    );
  }

  @action
  async deleteTrip() {
    await this.firebase.deleteTripByID(this.trip.id);
    this.router.refresh();
    this.router.transitionTo('visited');
  }
}

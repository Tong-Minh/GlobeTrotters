import Service from '@ember/service';
import { initializeApp } from 'firebase/app';
import { service } from '@ember/service';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  FieldPath,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
  listAll,
} from 'firebase/storage';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { imageOverlay } from 'leaflet';
import { v4 } from 'uuid';

const firebaseConfig = {
  apiKey: 'AIzaSyDOeavIlAkfoizxBmcE0mYz9ov09VHf9ok',
  authDomain: 'globetrotter-1bc35.firebaseapp.com',
  projectId: 'globetrotter-1bc35',
  storageBucket: 'globetrotter-1bc35.firebasestorage.app',
  messagingSenderId: '609734070989',
  appId: '1:609734070989:web:3013a842b7018a781b8f84',
  measurementId: 'G-T4HBP708MD',
};

export default class FirebaseService extends Service {
  app = initializeApp(firebaseConfig);
  db = getFirestore(this.app);
  store = getStorage();
  @tracked userTrips = [];
  @tracked userid = 0;
  @tracked userPeople = [];

  @service auth;
  @service helpers;

  @tracked achievementCount = 0;

  @action
  async signInUser(uid) {
    // When the user signs in, create an entry in the Users collection with their uid and visits set to 0.
    this.userid = uid;
    const users = collection(this.db, 'Users');
    let user = doc(users, this.auth.user.uid);
    const userinfo = await getDoc(user);
    if (!userinfo.exists()) {
      await setDoc(user, {
        uid: uid,
        visits: 0,
      });
    }
    console.log(userinfo);
    this.achievementCount = this.getVisits();
  }

  @action
  async getVisits() {
    // Get the number of visits a user currently has.
    try {
      const colRef = collection(this.db, 'Users');
      let docRef = doc(colRef, this.auth.user.uid);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const userInfo = userDoc.data();
        return userInfo.visits;
      } else {
        console.warn('User document does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user visits:', error);
      return null;
    }
  }

  @action
  async addTrip(
    title,
    description,
    country,
    state,
    start,
    end,
    tags,
    people,
    pictures,
  ) {
    const tripsCol = collection(this.db, `Users/${this.auth.user.uid}/Trips`);
    let newTrip = await doc(tripsCol);

    let links = [];
    let counter = 0;
    for (let pic of pictures) {
      const picid = v4();
      links.push({
        id: picid,
        link: await this.uploadPictureFireBaseStore(
          pic,
          this.auth.user.uid,
          newTrip.id,
          `${picid}`,
        ),
      });
      counter++;
    }

    await setDoc(newTrip, {
      id: newTrip.id,
      country: country,
      state: state,
      title: title,
      description: description,
      start: new Date(start),
      end: new Date(end),
      tags: tags,
      people: people,
      pictures: links,
      created: serverTimestamp(),
    });
    this.achievementCount = this.addVisit();
  }

  @action
  async addVisit() {
    // Increment the user's visited value by one.
    try {
      const colRef = collection(this.db, 'Users');
      let docRef = doc(colRef, this.auth.user.uid);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const userInfo = userDoc.data();
        const newNum = userInfo.visits + 1;
        await updateDoc(docRef, {
          visits: newNum,
        });
        return newNum;
      } else {
        console.warn('User document does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error incrementing user visits:', error);
      return null;
    }
  }

  @action
  async checkAchievements() {
    // Checking how many places a user has visited when adding a new visit
  }

  @action
  async uploadPictureFireBaseStore(picfile, userid, tripid, name) {
    const filepath = `Users/${userid}/Trip/${tripid}/${name}`;
    let curTrip = ref(this.store, filepath);
    await uploadBytes(curTrip, picfile);
    return await getDownloadURL(curTrip);
  }

  @action
  async deletePictureFireBaseStore(picid, userid, tripid) {
    const filepath = `Users/${userid}/Trip/${tripid}/${picid}`;
    console.log(filepath);
    console.log(picid);
    let pic = ref(this.store, filepath);
    await deleteObject(pic);
  }

  @action
  async uploadPersonPictureFBS(picfile, userid, personid) {
    const filepath = `Users/${userid}/People/${personid}`;
    let curPerson = ref(this.store, filepath);
    await uploadBytes(curPerson, picfile);
    return await getDownloadURL(curPerson);
  }

  @action
  async deletePersonPictureFBS(userid, picid) {
    try {
      const filepath = `Users/${userid}/People/${picid}`;
      const picRef = ref(this.store, filepath);

      try {
        await getMetadata(picRef);
        await deleteObject(picRef);
      } catch (e) {
        if (e.code === 'storage/object-not-found') {
          console.log('Picture already deleted or not found');
          return;
        }
        throw e;
      }
    } catch (error) {
      console.error('Delete picture failed:', error);
      throw error;
    }
  }

  @action
  async addNewPersonName(name) {
    const peopleCol = collection(this.db, `Users/${this.auth.user.uid}/People`);
    let person = await doc(peopleCol);

    let pic = { id: 'default', link: '/images/profile.svg' };

    await setDoc(person, {
      id: person.id,
      docID: person.id,
      name: name,
      pic: pic,
      created: serverTimestamp(),
    });
    return person.id;
  }

  @action
  async addNewPerson(name, picture) {
    const peopleCol = collection(this.db, `Users/${this.auth.user.uid}/People`);
    let person = await doc(peopleCol);
    let pic = {};
    const picid = v4();
    pic = {
      id: picid,
      link: await this.uploadPersonPictureFBS(
        picture,
        this.auth.user.uid,
        `${picid}`,
      ),
    };

    await setDoc(person, {
      id: person.id,
      docID: person.id,
      name: name,
      pic: pic,
      created: serverTimestamp(),
    });
    return person.id;
  }

  @action
  async deletePerson(personid) {
    const personDoc = doc(
      this.db,
      `Users/${this.auth.user.uid}/People/${personid}`,
    );
    const filepath = `Users/${this.auth.user.uid}/People/${personid}`;

    const person = await getDoc(personDoc);

    if (person.exists()) {
      const personImage = ref(this.store, filepath);
      await deleteObject(personImage);
      await deleteDoc(personDoc);
    }
  }

  @action
  async updatePerson(personid, name, picture) {
    try {
      const personDoc = doc(
        this.db,
        `Users/${this.auth.user.uid}/People/${personid}`,
      );
      const person = await getDoc(personDoc);

      if (person.exists()) {
        const personData = person.data();
        if (picture) {
          if (personData.pic && personData.pic.id !== 'default') {
            try {
              await this.deletePersonPictureFBS(
                this.auth.user.uid,
                personData.pic.id,
              );
            } catch (e) {
              console.log('Old picture deletion failed:', e);
            }
          }

          const picid = v4();
          const link = await this.uploadPersonPictureFBS(
            picture,
            this.auth.user.uid,
            picid,
          );

          await updateDoc(personDoc, {
            name,
            id: personid,
            docID: personid,
            pic: { id: picid, link },
          });

          return { ...personData, pic: { id: picid, link } };
        }
      }
    } catch (error) {
      console.error('Update person failed:', error);
      throw error;
    }
  }

  @action
  async getAllPeopleUser() {
    const peopleCol = collection(
      this.db,
      'Users',
      this.auth.user.uid,
      'People',
    );
    const person = query(peopleCol, orderBy('created', 'desc'));
    const personDoc = await getDocs(person);

    if (personDoc.empty) {
      console.log('No trips found - firebase');
      this.userPeople = [];
      return;
    }

    let allPeople = [];
    personDoc.forEach((trip) => {
      let personData = trip.data();
      allPeople.push({
        name: personData.name,
        pic: personData.pic,
        docID: trip.id,
      });
    });
    this.userPeople = allPeople;
    console.log('people', this.userPeople);
  }

  @action
  async getSpecificPerson(personid) {
    const peopleCol = collection(
      this.db,
      'Users',
      this.auth.user.uid,
      'People',
    );
    const person = doc(peopleCol, personid);
    const personDoc = await getDoc(person);

    if (!personDoc.exists()) {
      return {};
    }

    const personData = personDoc.data();
    return personData;
  }

  @action
  async getAllTripsUser() {
    console.log('grabbing trips for: ', this.auth.user.uid);

    const tripCol = collection(this.db, 'Users', this.auth.user.uid, 'Trips');
    const tripDocRef = query(tripCol, orderBy('start', 'desc'));
    const tripDoc = await getDocs(tripDocRef);

    if (tripDoc.empty) {
      console.log('No trips found - firebase');
      this.userTrips = [];
      return;
    }

    let allTrips = [];
    tripDoc.forEach((trip) => {
      let tripData = trip.data();

      let imgRef = this.helpers.getImageLink(tripData.country, tripData.state);

      allTrips.push({
        title: tripData.title,
        description: tripData.description,
        country: tripData.country,
        state: tripData.state,
        image: imgRef,
        startDate: tripData.start,
        endDate: tripData.end,
        tags: tripData.tags,
        people: tripData.people,
        photos: tripData.pictures,
        id: tripData.id,
        created: tripData.created,
      });
    });
    this.userTrips = allTrips;
    console.log('trips', this.userTrips);
  }

  @action
  async getSpecificTrip(tripid) {
    console.log('grabbing', this.auth.user.uid);
    const tripCol = collection(this.db, `Users/${this.auth.user.uid}/Trips`);
    const tripDocRef = doc(tripCol, tripid);
    const tripDoc = await getDoc(tripDocRef);

    if (!tripDoc.exists()) {
      console.error('Trip document does not exist');
      return null;
    }

    let tripdata = tripDoc.data();
    console.log('Trip data:', tripdata);

    let imgLink = this.helpers.getImageLink(tripdata.country, tripdata.state);

    let specTrip = {
      title: tripdata.title,
      description: tripdata.description,
      country: tripdata.country,
      state: tripdata.state,
      image: imgLink,
      startDate: tripdata.start,
      endDate: tripdata.end,
      tags: tripdata.tags,
      people: tripdata.people,
      photos: tripdata.pictures,
      id: tripid,
      created: tripdata.created,
    };

    return specTrip;
  }

  @action
  async deleteTripByID(tripid) {
    const filepath = `Users/${this.auth.user.uid}/Trip/${tripid}`;
    let curTrip = ref(this.store, filepath);
    let images = await listAll(curTrip);
    for (let image of images.items) {
      await deleteObject(image);
    }

    const tripDoc = doc(this.db, 'Users', this.auth.user.uid, 'Trips', tripid);
    await deleteDoc(tripDoc);
  }

  @action
  async updateTrip(
    tripid,
    title,
    description,
    start,
    end,
    tags,
    people,
    removedPictures = [],
    addedPictures = [],
  ) {
    const trip = doc(this.db, `Users/${this.auth.user.uid}/Trips/${tripid}`);

    let oldpicsdoc = await getDoc(trip);
    let oldpics = oldpicsdoc.data().pictures;
    console.log('Old', oldpics);
    if (removedPictures) {
      oldpics = oldpics.filter(
        (removed) => !removedPictures.includes(removed.id),
      );

      for (let picid of removedPictures) {
        await this.deletePictureFireBaseStore(
          picid,
          this.auth.user.uid,
          tripid,
        );
      }
    }

    let links = [];
    let counter = 0;
    for (let pic of addedPictures) {
      const picid = v4();
      links.push({
        id: picid,
        link: await this.uploadPictureFireBaseStore(
          pic,
          this.auth.user.uid,
          tripid,
          `${picid}`,
        ),
      });
      counter++;
    }

    console.log('New Old', oldpics);

    let updatedLinks = oldpics.concat(links);

    await updateDoc(trip, {
      title: title,
      description: description,
      start: new Date(start),
      end: new Date(end),
      tags: tags,
      people: people,
      pictures: updatedLinks,
    });
    await this.getAllTripsUser();
    await this.getAllPeopleUser();
  }
}

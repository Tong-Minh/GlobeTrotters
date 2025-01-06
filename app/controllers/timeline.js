import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TimelineController extends Controller {
  @tracked filterOpen = false;
  @tracked currentLocations = this.model.locations;
  @tracked resultsTags = [];
  @tracked resultsTitles = [];
  @tracked resultsPeople = [];
  @tracked resultsLocations = [];

  @tracked showAfter = false;
  @tracked showBefore = true;

  //===========================================================================
  // Filter Settings
  //===========================================================================

  @tracked titleExpanded = true;
  @tracked locationExpanded = true;
  @tracked dateExpanded = true;
  @tracked peopleExpanded = true;
  @tracked tagsExpanded = true;

  @tracked titleFiltered = false;
  @tracked locationFiltered = false;
  @tracked dateFiltered = false;
  @tracked peopleFiltered = false;
  @tracked tagsFiltered = false;

  filter = {
    title: [],
    location: [],
    before: null,
    after: null,
    tags: [],
    people: [],
  };

  @action
  clearFilterItem(event) {
    const filterType = event.target.getAttribute('filter-type');
    if (filterType) {
      switch (filterType) {
        case 'date':
          this.filter.before = null;
          this.filter.after = null;
          this.dateFiltered = false;

          if (document.getElementById('filterAfter'))
            document.getElementById('filterAfter').value = '';
          if (document.getElementById('filterBefore'))
            document.getElementById('filterBefore').value = '';

          document.getElementById('temporal').value = 'before';
          break;
        default:
          this.filter[filterType] = [];
          let filterItem = 'filter-' + filterType;
          let filtered = filterType + 'Filtered';
          this[filtered] = false;
          let capitalizedType = filterType.charAt(0).toUpperCase() + filterType.slice(1);
          document.getElementById('search' + capitalizedType).value = '';
          this['filterSearch' + capitalizedType]({ target: { value: '' } });
          document
            .getElementById(filterItem)
            .querySelectorAll('.filter-item')
            .forEach((item) => {
              if (item.checked) {
                item.checked = false;
              }
            });
          break;
      }
      this.filterLocations();
    }
  }

  //===========================================================================
  // Filter Toggle
  //===========================================================================

  @action
  filterToggle() {
    this.filterOpen = !this.filterOpen;
    if (this.filterOpen) {
      if (!this.resultsTags.length) {
        let tags = [];
        for (let location of this.model.locations) {
          if (location.tags) {
            for (let tag of location.tags) {
              if (!tags.includes(tag)) {
                tags.push(tag);
              }
            }
          }
        }
        this.resultsTags = tags.sort();
      }
      if (!this.resultsTitles.length) {
        let titles = [];
        for (let location of this.model.locations) {
          if (!titles.includes(location.title)) {
            titles.push(location.title);
          }
        }
        this.resultsTitles = titles.sort();
      }
      if (!this.resultsPeople.length) {
        let people = [];
        for (let location of this.model.locations) {
          if (location.people) {
            for (let person of location.people) {
              if (!people.some((p) => p.name === person.name)) {
                people.push(person);
              }
            }
          }
        }
        this.resultsPeople = people.sort();
      }
      if (!this.resultsLocations.length) {
        let locations = [];
        for (let location of this.model.locations) {
          if (location.state) {
            if (!locations.includes(location.state)) {
              locations.push(location.state);
            }
          } else if (location.country) {
            if (!locations.includes(location.country)) {
              locations.push(location.country);
            }
          }
        }
        this.resultsLocations = locations.sort();
      }
    }
  }

  @action
  toggleSpecificFilterExpand(divID) {
    let div = document.getElementById(divID);
    div.classList.toggle('hidden');

    switch (divID) {
      case 'title':
        this.titleExpanded = !this.titleExpanded;
        break;
      case 'location':
        this.locationExpanded = !this.locationExpanded;
        break;
      case 'date':
        this.dateExpanded = !this.dateExpanded;
        break;
      case 'people':
        this.peopleExpanded = !this.peopleExpanded;
        break;
      case 'tags':
        this.tagsExpanded = !this.tagsExpanded;
        break;
    }
  }

  //===========================================================================
  // Search Filters
  //===========================================================================

  @action
  filterSearchTitle(event) {
    let term = event.target.value.toLowerCase();
    console.log(term);
    let titles = [];
    for (let location of this.model.locations) {
      if (
        location.title.toLowerCase().includes(term) &&
        !titles.includes(location.title)
      ) {
        titles.push(location.title);
      }
    }
    this.resultsTitles = titles;
  }

  @action
  filterSearchLocation(event) {
    let term = event.target.value.toLowerCase();
    let locations = [];
    for (let location of this.model.locations) {
      if (location.state) {
        if (
          location.state.toLowerCase().includes(term) &&
          !locations.includes(location.state)
        ) {
          locations.push(location.state);
        }
      } else if (location.country) {
        if (
          location.country.toLowerCase().includes(term) &&
          !locations.includes(location.country)
        ) {
          locations.push(location.country);
        }
      }
    }
    this.resultsLocations = locations;
  }

  @action
  filterSearchPeople(event) {
    let term = event.target.value.toLowerCase();
    let people = [];
    for (let location of this.model.locations) {
      if (location.people) {
        for (let person of location.people) {
          if (
            person.name.toLowerCase().includes(term) &&
            !people.some((p) => p.name === person.name)
          )
            people.push(person);
        }
      }
    }
    this.resultsPeople = people;
  }

  @action
  filterSearchTags(event) {
    let term = event.target.value.toLowerCase();
    let tags = [];
    for (let location of this.model.locations) {
      if (location.tags) {
        for (let tag of location.tags) {
          if (tag.toLowerCase().includes(term) && !tags.includes(tag)) {
            tags.push(tag);
          }
        }
      }
    }
    this.resultsTags = tags;
  }

  //===========================================================================
  // Filter Locations
  //===========================================================================

  @action
  toggleFilterTitle(event) {
    if (!event.target.checked) {
      if (this.filter.title.includes(event.target.value)) {
        this.titleFiltered = false;
        this.filter.title = this.filter.title.filter(
          (title) => title !== event.target.value,
        );
      }
    } else {
      this.filter.title.push(event.target.value);
    }
    this.filterLocations();
  }

  @action
  toggleFilterLocation(event) {
    if (!event.target.checked) {
      if (this.filter.location.includes(event.target.value)) {
        this.locationFiltered = false;
        this.filter.location = this.filter.location.filter(
          (location) => location !== event.target.value,
        );
      }
    } else {
      this.filter.location.push(event.target.value);
    }
    this.filterLocations();
  }

  @action
  toggleFilterPeople(event) {
    if (!event.target.checked) {
      if (this.filter.people.includes(event.target.value)) {
        this.peopleFiltered = false;
        this.filter.people = this.filter.people.filter(
          (person) => person !== event.target.value,
        );
      }
    } else {
      this.filter.people.push(event.target.value);
    }
    this.filterLocations();
  }

  @action
  toggleFilterTag(event) {
    if (!event.target.checked) {
      if (this.filter.tags.includes(event.target.value)) {
        this.tagsFiltered = false;
        this.filter.tags = this.filter.tags.filter(
          (tag) => tag !== event.target.value,
        );
      }
    } else {
      this.filter.tags.push(event.target.value);
    }
    this.filterLocations();
  }

  //===========================================================================
  // Filter Locations Functionality
  //===========================================================================

  filterLocations() {
    if (this.filter.title.length) {
      this.titleFiltered = true;
    }
    if (this.filter.location.length) {
      this.locationFiltered = true;
    }
    if (this.filter.before || this.filter.after) {
      this.dateFiltered = true;
    }
    if (this.filter.people.length) {
      this.peopleFiltered = true;
    }
    if (this.filter.tags.length) {
      this.tagsFiltered = true;
    }

    this.currentLocations = this.model.locations.filter((location) => {
      //Filter by Title
      if (this.filter.title.length) {
        for (let title of this.filter.title) {
          if (!location.title.includes(title)) {
            return false;
          }
        }
      }

      //Filter by Location
      if (this.filter.location.length) {
        for (let local of this.filter.location) {
          if (location.state) {
            if (!location.state.includes(local)) {
              return false;
            }
          } else if (location.country) {
            if (!location.country.includes(local)) {
              return false;
            }
          }
        }
      }

      //Filter by Date
      if (this.filter.before || this.filter.after) {
        console.log('Location: ' + location.title);
        const filterEndDate = new Date(this.filter.before);
        const filterStartDate = new Date(this.filter.after);
        const locationStartDate = location.startDateObject;
        const locationEndDate = location.endDateObject;

        if (this.showAfter && this.showBefore) {
          if (locationStartDate && locationEndDate) {
            if (
              locationStartDate > filterEndDate ||
              locationEndDate < filterStartDate
            ) {
              return false;
            }
          }
        } else if (this.showBefore) {
          if (locationStartDate) {
            if (locationStartDate > filterEndDate) {
              return false;
            }
          }
        } else if (this.showAfter) {
          if (locationEndDate) {
            if (locationEndDate < filterStartDate) {
              return false;
            }
          }
          console.log('Location End Date: ' + locationEndDate);
          console.log('Filter Start Date: ' + filterStartDate);
        }
      }
      console.log('============================================\n');

      //Filter by People
      if (this.filter.people.length) {
        for (let person of this.filter.people) {
          if (location.people) {
            if (!location.people.some((p) => p.name === person)) {
              return false;
            }
          }
        }
      }

      //Filter by Tags
      if (this.filter.tags.length) {
        for (let tag of this.filter.tags) {
          if (location.tags) {
            if (!location.tags.includes(tag)) {
              return false;
            }
          }
        }
      }
      return true;
    });
  }

  @action
  clearFilter() {
    this.filter = {
      title: [],
      location: [],
      startDate: null,
      endDate: null,
      tags: [],
      people: [],
    };
    Array.from(document.getElementsByClassName('filter-item')).forEach(
      (element) => {
        if (element.checked) {
          element.checked = false;
        }
      },
    );
    this.titleFiltered = false;
    this.locationFiltered = false;
    this.dateFiltered = false;
    this.peopleFiltered = false;
    this.tagsFiltered = false;

    const searchTitle = document.getElementById('searchTitle');
    const searchLocation = document.getElementById('searchLocation');
    const filterAfter = document.getElementById('filterAfter');
    const filterBefore = document.getElementById('filterBefore');
    const searchPeople = document.getElementById('searchPeople');
    const searchTags = document.getElementById('searchTags');

    if (searchTitle) searchTitle.value = '';
    if (searchLocation) searchLocation.value = '';
    if (filterAfter) filterAfter.value = '';
    if (filterBefore) filterBefore.value = '';
    if (searchPeople) searchPeople.value = '';
    if (searchTags) searchTags.value = '';

    this.filterSearchTitle({ target: { value: '' } });
    this.filterSearchLocation({ target: { value: '' } });
    this.filterSearchPeople({ target: { value: '' } });
    this.filterSearchTags({ target: { value: '' } });

    console.log('Model Locations', this.model.locations);
    this.currentLocations = this.model.locations;
  }

  @tracked showBefore = true;
  @tracked showAfter = false;

  @action
  setTemporal(event) {
    let temporal = event.target.value;
    switch (temporal) {
      case 'before':
        this.showBefore = true;
        this.showAfter = false;
        break;
      case 'between':
        this.showBefore = true;
        this.showAfter = true;
        break;
      case 'after':
        this.showBefore = false;
        this.showAfter = true;
        break;
    }
  }

  @action
  setBefore(event) {
    this.filter.before = event.target.value;
    console.log('Filter Start ' + this.filter.before);
    this.filterLocations();
  }

  @action
  setAfter(event) {
    this.filter.after = event.target.value;
    console.log('Filter End ' + this.filter.after);
    this.filterLocations();
  }
}

//call dependencies
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//create whole app component
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fav: [],
      unFav: [],
      clickedContact: {
        "name": "",
        "id": "",
        "companyName": "",
        "isFavorite": "",
        "smallImageURL": "",
        "largeImageURL": "",
        "emailAddress": "",
        "birthdate": "",
        "phone": {
          "work": "",
          "home": "",
          "mobile": ""
        },
        "address": {
          "street": "",
          "city": "",
          "state": "",
          "country": "",
          "zipCode": ""
        }
      },
      contactClicked: false
    };

    this.toggleClick = this.toggleClick.bind(this);
    this.favClick = this.favClick.bind(this);
    this.modalExit = this.modalExit.bind(this);

  }

  //call data and sort fav/unfav
  componentWillMount() {

    fetch('https://s3.amazonaws.com/technical-challenge/v3/contacts.json').then(response => response.json()).then(data => {
      console.log(data)
      var fav = []
      var unFav = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].isFavorite === true) {
          fav.push(data[i]);
        } else {
          unFav.push(data[i]);
        }
      }
      this.setState({fav: fav, unFav: unFav})
    });
  };

  //get data from clicked contact
  toggleClick(contact) {
    console.log(contact);
    this.setState({contactClicked: true, clickedContact: contact, showModal: true});
  };

  //decide to show or hide contact modal
  modalExit() {
    this.setState({showModal: false});
  };

  //handle the star click to fav/unfav the contact
  favClick(someId, currentFavStatus) {

    let newFav = [...this.state.fav];
    let newUnfav = [...this.state.unFav];

    let propId = someId;

    if (currentFavStatus === true) {
      let newIndex = "";

      for (let i = 0; i < newFav.length; i++) {
        if (newFav[i].id === propId) {
          newIndex = i
        }
      }
      newUnfav.push(newFav[newIndex]);
      newUnfav[newUnfav.length - 1].isFavorite = false;
      newFav.splice(newIndex, 1);
      this.setState({unFav: newUnfav, fav: newFav});
    } else {
      let newIndex = "";

      for (let i = 0; i < newUnfav.length; i++) {
        if (newUnfav[i].id === propId) {
          newIndex = i
        }
      }
      newFav.push(newUnfav[newIndex]);
      newFav[newFav.length - 1].isFavorite = true;
      newUnfav.splice(newIndex, 1);
      this.setState({unFav: newUnfav, fav: newFav});
    };
  };

  //render the whole App
  render() {

    return (
      <div>
        <div className="header">
          <h1>Contacts</h1>
        </div>
        <div className="contactList">
          <h2>Favorite Contacts</h2>
          {this.state.fav.map((item, i) => <FavoriteContacts key={i} fav={item} parentHandler={this.toggleClick}/>)}
          <h2>Other Contacts</h2>
          {this.state.unFav.map((item, i) => <OtherContacts key={i} other={item} parentHandler={this.toggleClick}/>)}
          <ActiveContact info={this.state.clickedContact} handleClick={this.favClick} modalExit={this.modalExit}/>
        </div>
      </div>
    )
  }
}

//create new component for favorite contacts
class FavoriteContacts extends Component {
  constructor(props) {
    super(props);
    this.expandContact = this.expandContact.bind(this);
  }

  expandContact() {
    this.props.parentHandler(this.props.fav);
  }

  render() {
    return (
      <div className='contacts' onClick={this.expandContact}>
        <img src={this.props.fav.smallImageURL}/>
        <div className='starIcon'>⭐</div>
        <div className='contactInfo'>
          <h4>{this.props.fav.name}</h4>
          <p>{this.props.fav.companyName}</p>
        </div>
      </div>
    )
  }
}

//create new component for other contacts
class OtherContacts extends Component {
  constructor(props) {
    super(props);
    this.expandContact = this.expandContact.bind(this);
  }
  expandContact() {
    this.props.parentHandler(this.props.other);
  }

  render() {
    return (
      <div className='contacts' onClick={this.expandContact}>
        <img src={this.props.other.smallImageURL}/>
        <div className='contactInfo'>
          <h4>{this.props.other.name}</h4>
          <p>{this.props.other.companyName}</p>
        </div>
      </div>
    )
  }
}

//create new component for active/selected contact
class ActiveContact extends Component {
  constructor(props) {
    super(props);
    this.helperClassName = "noShow";
  };

  checkIfChosenContact = () => {
    if (this.helperClassName === "noShow") {
      console.log("I have a user");
      this.helperClassName = "showModal";
    } else {
      this.helperClassName = "noShow";
    }
  };

  componentWillReceiveProps() {
    console.log("receiving props");
    console.log(this.props);
  };

  componentDidUpdate() {
    this.checkIfChosenContact();
  };

  render(props) {
    console.log(this.props.info);
    let someId = this.props.info.id;
    let currentFavStatus = this.props.info.isFavorite;

    return (
      <div className={this.helperClassName + ' activeContact'}>
        <div className='activeHeader'>
          <div className='contactButton' onClick={() => {
            this.props.modalExit()
          }}>
            <i className="fa fa-angle-left" aria-hidden="true"></i>Contacts</div>
          {this.props.info.isFavorite === true
            ? <button className="starstar" onClick={() => {
                this.props.handleClick(someId, currentFavStatus)
              }}>
                &#9733;
              </button>
            : <button className="starstar" onClick={() => {
              this.props.handleClick(someId, currentFavStatus)
            }}>
              &#9734;
            </button>}
        </div>
        <img src={this.props.info.largeImageURL}/>
        <h3>{this.props.info.name !== ""
            ? this.props.info.name
            : "help"}</h3>
        <h5>{this.props.info.companyName}</h5>
        {this.props.info.phone.home !== "" && this.props.info.phone.home !== undefined
          ? <div className="category">
              <h6>Phone:
              </h6>
              <p>{this.props.info.phone.home}</p>
              <div className="phoneType">
                Home
              </div>
            </div>
          : <h5 className="noShow">Not Provided</h5>}
        {this.props.info.phone.mobile !== "" && this.props.info.phone.mobile !== undefined
          ? <div className="category">
              <h6>Phone:
              </h6>
              <p>{this.props.info.phone.mobile}</p>
              <div className="phoneType">
                Mobile
              </div>
            </div>
          : <h5 className="noShow">Not Provided</h5>}
        {this.props.info.phone.work !== "" && this.props.info.phone.work !== undefined
          ? <div className="category">
              <h6>
                Phone:
              </h6>
              <p>{this.props.info.phone.work}</p>
              <div className="phoneType">
                Work
              </div>
            </div>
          : <h5 className="noShow">Not Provided</h5>}
        <div className="category">
          <h6>
            Address:
          </h6>
          <p>{this.props.info.address.street}</p>
          <p>{this.props.info.address.city}, {this.props.info.address.state}, {this.props.info.address.zipCode}, {this.props.info.address.country}</p>

        </div>
        <div className="category">
          <h6>
            Birthdate:
          </h6>
          <p>{this.props.info.birthdate}</p>
        </div>

        <div className="category">
          <h6>
            Email:
          </h6>
          <p>{this.props.info.emailAddress}</p>
        </div>

      </div>
    )
  }
}

export default App;

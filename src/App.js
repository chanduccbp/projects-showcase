import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

// Replace your code here
class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    category: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {category} = this.state

    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${category}`,
    )
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachObj => ({
        id: eachObj.id,
        name: eachObj.name,
        imageUrl: eachObj.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  updateCategory = event => {
    this.setState({category: event.target.value}, this.getProjects)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="fv-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fv-pic"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="butt" onClick={this.getProjects} type="button">
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {projectsList} = this.state

    return (
      <ul className="p-list">
        {projectsList.map(eachObj => (
          <li className="p-item" key={eachObj.id}>
            <img src={eachObj.imageUrl} alt={eachObj.name} className="p-pic" />
            <p className="p-para">{eachObj.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProjects()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state

    return (
      <div className="p-cont">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="w-logo"
          />
        </nav>
        <select
          className="select-el"
          onChange={this.updateCategory}
          value={category}
        >
          {categoriesList.map(eachObj => (
            <option key={eachObj.id} value={eachObj.id}>
              {eachObj.displayText}
            </option>
          ))}
        </select>
        {this.renderView()}
      </div>
    )
  }
}

export default App

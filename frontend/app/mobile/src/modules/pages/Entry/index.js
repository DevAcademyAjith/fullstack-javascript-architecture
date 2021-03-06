// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { View, AsyncStorage, Linking } from 'react-native'
import RNLanguages from 'react-native-languages'

// UI Imports
import { white } from '../../../ui/common/colors'
import styles from './styles'

// App Imports
import translate from '../../../setup/translate'
import routeNames from '../../../setup/routes/names'
import { setUser, logout } from '../../user/api/actions/query'
import Body from '../../common/Body'
import Loading from '../../common/Loading'

// Component
class Entry extends PureComponent {
  componentDidMount() {
    this.setLanguage()

    this.checkLogin()
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  setLanguage = async () => {
    axios.defaults.headers.common['Language'] = RNLanguages.language
  }

  checkLogin = async () => {
    const { setUser, navigation, logout } = this.props

    try {
      const token = await AsyncStorage.getItem('token')

      if (token && token !== 'undefined' && token !== '') {
        const user = JSON.parse(await AsyncStorage.getItem('user'))

        if (user) {
          setUser(token, user)

          navigation.navigate(routeNames.postLoginStack)
        } else {
          this.showLogin()
        }
      } else {
        this.showLogin()
      }
    } catch (e) {
      this.showLogin()
    }
  }

  showLogin = () => {
    const { navigation, logout } = this.props

    logout()

    navigation.navigate(routeNames.preLoginStack)
  }

  render() {
    return (
      <Body fullscreen={true}>
        <View style={styles.container}>
          <Loading message={translate.t('common.loading')} />
        </View>
      </Body>
    )
  }
}

// Component Properties
Entry.propTypes = {
  auth: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
}

// Component State
function entryState(state) {
  return {
    auth: state.auth
  }
}

export default connect(entryState, { setUser, logout })(Entry)

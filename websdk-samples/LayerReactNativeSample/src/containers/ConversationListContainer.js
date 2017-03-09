import React, { Component, PropTypes } from 'react';

import {
  View,
  StyleSheet
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { QueryBuilder } from 'layer-websdk/index-react-native';
import { connectQuery } from 'layer-react';
import * as MessengerActions from '../actions/messenger';
import ConversationList from '../ui/ConversationList';
import ConversationListHeader from '../ui/ConversationListHeader';

/**
 * Copy data from reducers into our properties
 */
function mapStateToProps({ app, announcementState, participantState, activeConversation }) {
  return {
    owner: app.owner,
    ready: app.ready,
    activeConversationId: activeConversation.activeConversationId,
    showAnnouncements: announcementState.showAnnouncements,
    participantState
  };
}

/**
 * Copy all actions into this.props.actions
 */
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(MessengerActions, dispatch) };
}

/**
 * Setup all of the Queries; will set the query results to be
 * this.props.conversations, this.props.announcements, this.props.users.
 * Message query is setup elsewhere.
 */
function getQueries() {
  return {
    conversations: QueryBuilder.conversations(),
    announcements: QueryBuilder.announcements(),
    users: QueryBuilder.identities(),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class ConversationListContainer extends Component {

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps);
    if (nextProps.activeConversationId &&
      nextProps.activeConversationId !== this.props.activeConversationId) {

        this.props.navigator.push({
          name: 'ActiveConversation'
        });
    }
  }

  /**
   * Hide the Announcements Dialog
   */
  hideAnnouncements = (event) => {
    const { actions } = this.props;
    const { hideAnnouncements } = actions;
    // if (event.target.parentNode.classList.contains('announcements-dialog')) {
      hideAnnouncements();
    // }
  }

  /**
   * Hide the Participants Dialog
   */
  hideParticipants = (event) => {
    const { actions } = this.props;
    const { hideParticipants } = actions;
    // if (event.target.parentNode.classList.contains('participants-dialog')) {
      hideParticipants();
    // }
  }

  // handleConversationSelected(conversationID) {
  //   console.log('handleConversationSelected', conversationID);
  //   this.props.navigator.push({
  //     name: 'ActiveConversation',
  //     conversationID: conversationID
  //   })
  //   this.props.actions.selectConversation(conversationID);
  // }

  /**
   * Render the left panel with the Conversation List and List Header
   */
  // renderLeftPanel() {
  //   const {
  //     owner,
  //     conversations,
  //     announcements,
  //     activeConversationId,
  //     actions
  //   } = this.props;
  //
  //   return (
  //     <div className='left-panel'>
  //       <ConversationListHeader
  //         owner={owner}
  //         unreadAnnouncements={Boolean(announcements.filter(item => item.isUnread).length)}
  //         onShowAnnouncements={actions.showAnnouncements}
  //         onShowParticipants={actions.showParticipants}/>
  //       <ConversationList
  //         conversations={conversations}
  //         activeConversationId={activeConversationId}
  //         onDeleteConversation={actions.deleteConversation}/>
  //     </div>
  //   );
  // }

  /**
   * Render the Announcements dialog.
   */
  renderAnnouncementDialog() {
    const { announcements, actions } = this.props;
    return (
      <div
        onClick={this.hideAnnouncements}
        className="announcements-dialog dialog">
        <div>
          <AnnouncementsList
            messages={announcements}
            onMarkMessageRead={actions.markMessageRead}/>
        </div>
      </div>
    );
  }

  /**
   * Render the Participants dialog.
   */
  renderParticipantDialog() {
    const { owner, users, participantState, actions } = this.props;
    const selectedParticipants = participantState.participants;

    return (
      <div
        onClick={this.hideParticipants}
        className="participants-dialog dialog">
        <div>
          <UserListDialog
            users={users.filter(user => user.id !== owner.id)}
            selectedUsers={selectedParticipants}
            onUserSelected={actions.addParticipant}
            onUserUnselected={actions.removeParticipant}
            onSave={actions.createConversation}/>
        </div>
      </div>
    );
  }

  /**
   * Render the Main UI
   */
  // renderMessenger() {
  //   const {
  //     showAnnouncements,
  //     participantState,
  //     users,
  //     conversations,
  //     announcements
  //   } = this.props;
  //   const { showParticipants } = participantState;
  //
  //   // Render the left-panel which contains the Conversation List
  //   // and the right-panel which consists of the child components
  //   // (currently IndexRoute and Route with ActiveConversation)
  //   return (
  //     <div className='messenger'>
  //       {this.renderLeftPanel()}
  //       {this.props.children && React.cloneElement(this.props.children, {
  //         conversations,
  //         users
  //       })}
  //       {showAnnouncements ? this.renderAnnouncementDialog() : <span />}
  //       {showParticipants ? this.renderParticipantDialog() : <span />}
  //     </div>
  //   );
  // }

  /**
   * If we are ready, render the Messenger, else render a blank screen
   */
  render() {
    const {
      owner,
      conversations,
      announcements,
      activeConversationId,
      actions
    } = this.props;

    if (this.props.ready) {
      return (
        <View style={styles.container}>
          <ConversationListHeader
            owner={owner}
            unreadAnnouncements={Boolean(announcements.filter(item => item.isUnread).length)}
            onShowAnnouncements={actions.showAnnouncements}
            onShowParticipants={actions.showParticipants}/>
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={actions.selectConversation}
            onDeleteConversation={actions.deleteConversation}/>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

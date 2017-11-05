import {handleProjectConnections} from 'universal/mutations/UpdateProjectMutation';

const subscription = graphql`
  subscription ProjectUpdatedSubscription($teamIds: [ID!]) {
    projectUpdated(teamIds: $teamIds) {
      project {
        id
        content
        createdAt
        integration {
          service
          nameWithOwner
          issueNumber
        }
        status
        tags
        teamMemberId
        updatedAt
        teamMember {
          id
          picture
          preferredName
        }
      }
    }
  }
`;

const ProjectUpdatedSubscription = (environment, queryVariables, subParams) => {
  const {viewerId} = environment;
  const {operationName} = subParams;
  const {teamId} = queryVariables;
  // kinda hacky, but cleaner than creating a separate file
  const variables = operationName === 'UserDashRootQuery' ? {} : {teamIds: [teamId]};
  return {
    subscription,
    variables,
    updater: (store) => {
      const project = store.getRootField('projectUpdated').getLinkedRecord('project');
      handleProjectConnections(store, viewerId, project, teamId);
    }
  };
};

export default ProjectUpdatedSubscription;

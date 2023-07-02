import * as React from "react";
import { useParams } from "react-router-dom";
import "./style-sessions.css";
import { gql, useQuery } from "@apollo/client";

/* Define queries, mutations and fragments here */
const SPEAKER_ATTRIBUTES = gql`
  fragment SpeakerInfo on Speaker {
    id
    bio
    name
    sessions {
      id
      title
    }
  }
`;

const SPEAKERS_QUERY = gql`
  query speakers {
    speakers {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`;

const SPEAKER_BY_ID_QUERY = gql`
  query speakerById($id: ID!) {
    speakerById(id: $id) {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`;

const SpeakerList = () => {
  const { loading, error, data } = useQuery(SPEAKERS_QUERY);
  const featured = false;

  if (loading) {
    return <p>Loading speakers...</p>
  }
  if (error) {
    return <p>Error fetching speakers...</p>
  }

  return data.speakers.map(({ id, name, bio, sessions }) => (
		<div
      key={id}
      className="col-xs-12 col-sm-6 col-md-6"
      style={{ padding: 5 }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{ name }</h3>
        </div>
        <div className="panel-body">
          <h5>{ bio }</h5>
        </div>
        <div className="panel-footer">
          <h4>Sessions</h4>
					{
						sessions.map((session) => (
              <span key={session.id} style={{ padding: 2 }}>
                <p>{ session.title }</p>
              </span>
            ))
					}
          <span>	
            <button	
              type="button"	
              className="btn btn-default btn-lg"	
              onClick={()=> {
                /* ---> Call useMutation's mutate function to mark speaker as featured */
              }}	
              >	
                <i	
                  className={`fa ${featured ? "fa-star" : "fa-star-o"}`}	
                  aria-hidden="true"	
                  style={{	
                    color: featured ? "gold" : undefined,	
                  }}	
                ></i>{" "}	
                Featured Speaker	
            </button>	
          </span>
        </div>
      </div>
    </div>
	));
};

const SpeakerDetails = () => {
  const { speaker_id } = useParams();
  const { loading, error, data } = useQuery(SPEAKER_BY_ID_QUERY, {
    variables: { id: speaker_id },
  });

  if (loading) {
    return <p>Loading speaker...</p>;
  }
  if (error) {
    return <p>Error loading the speaker information...</p>
  }

  const speaker = data.speakerById;
  const { id, name, bio, sessions } = speaker;

  return (
    <div key={id} className="col-xs-12" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{ name }</h3>
        </div>
        <div className="panel-body">
          <h5>{ bio }</h5>
        </div>
        <div className="panel-footer">
          { sessions.map(({ id, title }) => (
            <p key={id}>{title}</p>
          )) }
        </div>
      </div>
    </div>
  );
};

export function Speaker() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerDetails />
        </div>
      </div>
    </>
  );
}

export function Speakers() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}

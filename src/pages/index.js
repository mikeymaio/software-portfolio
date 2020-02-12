import React from 'react';
import { graphql } from 'gatsby';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import Hero from '../components/hero/hero';
import About from '../components/about/about';
import ProjectList from '../components/project/project.list';
import ArticlePreview from '../components/article-preview/article-preview';
import SkillList from '../components/skills/skillList';
import ContactForm from '../components/contact/contact.form';
import Footer from '../components/footer/footer';

import styles from './index.module.css';

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const projects = get(this, 'props.data.allContentfulProject.edges');
    const [author] = get(this, 'props.data.allContentfulPerson.edges');
    const [about] = get(this, 'props.data.allContentfulAbout.edges');
    const [skills] = get(this, 'props.data.allContentfulSkills.edges');
    const [contact] = get(this, 'props.data.allContentfulContactForm.edges');
    const [social] = get(this, 'props.data.allContentfulSocialLinks.edges');

    return (
      <Layout location={this.props.location} >
        <div className={styles.wrapper}>
          <Helmet title={siteTitle}>
            <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous" />

            <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet" />

            <link href="https://fonts.googleapis.com/css?family=Sriracha&display=swap" rel="stylesheet" />
          </Helmet>
          <Hero data={author.node} />
          <About data={about.node} />
          <ProjectList projects={projects} />
          <SkillList skills={skills.node} />
          {!!contact && <ContactForm contact={contact} social={social} />}
          <Footer social={social} />
        </div>
      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulProject(sort: { fields: [sortOrder], order: ASC }) {
      edges {
        node {
          projectName
          company
          sortOrder
          image {
            fluid(maxWidth: 200, maxHeight: 150, resizingBehavior: FILL) {
             ...GatsbyContentfulFluid_tracedSVG
            }
          }
          description
          iosLink
          androidLink
          webLink
          codeLink
          technologies
        }
      }
    }
    allContentfulPerson(filter: { contentful_id: { eq: "15jwOBqpxqSAOy2eOO4S0m" } }) {
      edges {
        node {
          name
          shortBio {
            shortBio
          }
          title
          heroImage: image {
            fluid(
              maxWidth: 2000
              resizingBehavior: FILL
              background: "rgb:FFFFFF"
            ) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }

    allContentfulAbout(filter: { contentful_id: { eq: "4lF6ZjzmFHnSv5aGba96ii" } }) {
      edges {
        node {
          headline
          description {
            description
          }
        }
      }
    }
    allContentfulSkills {
      edges {
        node {
          frontend
          backend
          other
        }
      }
    }

    allContentfulContactForm {
      edges {
        node {
          title
          showSocial
          backgroundImage {
            fluid(
              maxWidth: 2000
              resizingBehavior: FILL
              background: "rgb:FFFFFF"
            ) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }

    allContentfulSocialLinks {
      edges {
        node {
          linkedIn
          github
          instagram
        }
      }
    }
  }
`;

import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Hero from '../components/hero'
import About from '../components/about'
import Layout from '../components/layout'
import ArticlePreview from '../components/article-preview'
import SkillList from '../components/skillList'

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allContentfulBlogPost.edges')
    const [author] = get(this, 'props.data.allContentfulPerson.edges')
    const [about] = get(this, 'props.data.allContentfulAbout.edges');
    const [skills] = get(this, 'props.data.allContentfulSkills.edges')

    console.log('skills: ', skills);

    return (
      <Layout location={this.props.location} >
        <div style={{ background: '#fff', paddingTop: 60 }}>
          <Helmet title={siteTitle} />
          <Hero data={author.node} />
          <About data={about.node} />
          <div className="wrapper" id="recentWork">
            <h2 className="section-headline">Recent Work</h2>
            <ul className="article-list">
              {posts.map(({ node }) => {
                return (
                  <li key={node.slug}>
                    <ArticlePreview article={node} />
                  </li>
                )
              })}
            </ul>
          </div>
          <SkillList skills={skills.node} />
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
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "MMMM Do, YYYY")
          tags
          heroImage {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
             ...GatsbyContentfulFluid_tracedSVG
            }
          }
          description {
            childMarkdownRemark {
              html
            }
          }
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
              resizingBehavior: PAD
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
          skills
        }
      }
    }
  }
`

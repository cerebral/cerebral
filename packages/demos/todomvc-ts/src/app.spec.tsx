import React from 'react'
import app from './app'
import { Snapshot } from 'cerebral/test'
import { Container } from '@cerebral/react'
import renderer from 'react-test-renderer'
import Footer from './components/Footer'
import List from './components/List'

test('should filter on all', () => {
  return Snapshot(app)
    .run('filterClicked', { filter: 'all' })
    .then((snapshot) => {
      const tree = renderer
        .create(
          <Container controller={snapshot.controller}>
            <Footer />
          </Container>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
      expect(snapshot.get()).toMatchSnapshot()
    })
})

test('should add new todo', () => {
  return Snapshot(app)
    .mutate('set', 'filter', 'all')
    .mutate('set', 'newTodoTitle', 'h')
    .mock('id.create', 'fc033770-7d95-4ac2-a0b2-c68e0f26700e')
    .run('newTodoSubmitted', {})
    .then((snapshot) => {
      const tree = renderer
        .create(
          <Container controller={snapshot.controller}>
            <List />
          </Container>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
      expect(snapshot.get()).toMatchSnapshot()
    })
})

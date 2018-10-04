/* global test, expect */
import React from 'react'
import main from './main'
import { Snapshot } from 'cerebral/test'
import { Container } from '@cerebral/react'
import renderer from 'react-test-renderer'
import Footer from './components/Footer'
import List from './components/List'

test('should filter on all', () => {
  return Snapshot(main)
    .run('changeFilter', { filter: 'all' })
    .then((snapshot) => {
      const tree = renderer
        .create(
          <Container app={snapshot.app}>
            <Footer />
          </Container>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
      expect(snapshot.get()).toMatchSnapshot()
    })
})

test('should add new todo', () => {
  return Snapshot(main)
    .mutate('set', 'filter', 'all')
    .mutate('set', 'newTodoTitle', 'h')
    .mock('id.create', 'fc033770-7d95-4ac2-a0b2-c68e0f26700e')
    .run('submitNewTodo', {})
    .then((snapshot) => {
      const tree = renderer
        .create(
          <Container app={snapshot.app}>
            <List />
          </Container>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
      expect(snapshot.get()).toMatchSnapshot()
    })
})

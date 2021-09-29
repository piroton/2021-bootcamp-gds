import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import {
  Container,
  Row,
  Col,
  Section,
  Button,
} from 'sgds-govtech-react';

import CONFIG from '../config';
import Table from '../components/Table';

export type TodoItemProps = {
  id: string,
  description: string,
  done: boolean,
};



function TodoItem(props: TodoItemProps) {
  /* create state here */
  const [done, setDone] = useState(props.done);

  const updateTodoItem = useCallback(async () => {
    await axios.put(`${CONFIG.API_ENDPOINT}/todos/${props.id}`, {
      id: props.id,
      description: props.description,
      done: done,
      /* persist the state of the todo item */
    });
  }, [props.description, props.id, done]);

  useEffect(() => {
    console.log(props.description, 'marked as ', done? 'done': 'undone');
    updateTodoItem();
    /* mark the todo when done (as a dependency) changes */
  }, [props.description, updateTodoItem, done]);

  return (<>
    <tr>
      <td><input type="checkbox" 
      onChange={(event) => setDone(event.currentTarget.checked)} 
      checked={done}></input></td>
      <td width={'100%'}>{props.description}</td>
    </tr>
  </>
  );
}

interface TodoProps {

}

function Todo(props: TodoProps) {
  const [todoItems, setTodoItems] = useState<{ [id: string]: TodoItemProps }>({});
  const [newTodoDescription, setNewTodoDescription] = useState('');

  const populateTodos = useCallback(async () => {
    const result = await axios.get(`${CONFIG.API_ENDPOINT}/todos`);
    setTodoItems(result.data);
  }, []);

  const onRefreshClicked = useCallback(async () => {
    console.log('Refresh button clicked');
    setIsRefresh(true);
    setTimeout(async ()=> {
      await populateTodos();
      setIsRefresh(false);
    }, 400);
    console.log('Refresh todoList');
  }, [populateTodos]);

  useEffect(() => {
    onRefreshClicked();
  }, [onRefreshClicked]);


  const [isRefresh, setIsRefresh] = useState(false);

  async function submitNewTodo() {
    var s = newTodoDescription.trim();
    // newTodoDescription.trim();
    if (s !== ""){
      const newTodo = {
        description: newTodoDescription,
      };
      await axios.post(`/api/todos`, newTodo);
      await populateTodos();
      setNewTodoDescription('');
    } else {
      alert("Please enter a message that isn't just whitespace.")
    }
    /* validate todos here */
  }

  return (
    <Container>
      <Row>
        <Col>
          <Section className='has-background-gradient'>
            <h3>Todo App</h3>
          </Section>
          <Section isSmall>
            <form action='#' onSubmit={(event) => {
              submitNewTodo();
              event?.preventDefault();
            }}>
              <div className='field'>
                <label className="label" htmlFor="newTodoDescription">New todo: </label>
                <div className='control'>
                  <Row>
                    <Col is={10}>
                      <input className="input" id='newTodoDescription' type='text' value={newTodoDescription}
                        onChange={(event) => { setNewTodoDescription(event.currentTarget.value) }} />
                    </Col>
                    <Col>
                      <Button isPrimary isLoading={false}>Submit</Button>
                    </Col>
                    <Col>
                    <Button type="button" isOutline isLoading={isRefresh} onClick={()=> {onRefreshClicked()}}>
                      <span className='sgds-icon sgds-icon-refresh'/>
                    </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </form>
          </Section>
          <Section isSmall>
            <Table isFullwidth isHoverable isHorizontal isBordered>
              <thead><tr><th>Done</th><th>Description</th></tr></thead>
              <tbody>
                {
                  Object.keys(todoItems).map((item) => (<TodoItem key={todoItems[item].id} {...todoItems[item]} />))
                }
              </tbody>
            </Table>
          </Section>
        </Col>
      </Row>
    </Container>
  );
}

export default Todo;

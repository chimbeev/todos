import { render, screen } from '@testing-library/react';
import App from './App';

//Тестируем с помощью jest приложение React
//Точнее тестируем появился ли элемент интерфейса
test('renders learn react link', async () => {
  render(<App/>);
  //render(<App />);
  const linkElement = screen.getByText(/todos/i);
  expect(linkElement).toBeInTheDocument();
});

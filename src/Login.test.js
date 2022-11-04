import { render, screen } from '@testing-library/react';
import Login from './Login';


test('renders learn react link', async () => {
    render(<Login/>);
    //render(<App />);
    const linkElement = screen.getByText(/Пароль/i);
    expect(linkElement).toBeInTheDocument();
});

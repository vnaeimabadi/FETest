import React from 'react';
import {Home} from '../src/screens';
import {render, fireEvent, cleanup} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

afterEach(cleanup);

describe('Testing Exchange', () => {
  it('check all elements to be in right place', () => {
    const {queryByTestId, queryByText} = render(<Home />);

    const exchangeButton = queryByTestId(/ExchangeButton/i);
    const topPickerButton = queryByTestId(/topPickerButton/i);
    const topPickerList = queryByTestId(/topPickerList/i);
    const bottomPickerButton = queryByTestId(/bottomPickerButton/i);
    const bottomPickerList = queryByTestId(/bottomPickerList/i);
    const topInput = queryByTestId(/topInput/i);
    const bottomInput = queryByTestId(/bottomInput/i);
    const Exceeds = queryByText(/Exceeds balance/i);

    expect(Exceeds).not.toBeTruthy();
    expect(topPickerButton).toBeTruthy();
    expect(topPickerList).not.toBeTruthy();
    expect(bottomPickerButton).toBeTruthy();
    expect(bottomPickerList).not.toBeTruthy();
    expect(topInput).toBeTruthy();
    expect(bottomInput).toBeTruthy();
    expect(exchangeButton).toBeTruthy();
    expect(exchangeButton).toBeDisabled();
  });

  it('open the top picker to select one currency type', () => {
    const {queryByTestId} = render(<Home />);
    const topPickerButton = queryByTestId(/topPickerButton/i);
    const topPickerList = queryByTestId(/topPickerList/i);

    expect(topPickerButton).toBeTruthy();
    expect(topPickerList).not.toBeTruthy();
    fireEvent.press(topPickerButton);
    expect(queryByTestId(/topPickerList/i)).toBeTruthy();
  });

  it('open the bottom picker to select one currency type', () => {
    const {queryByTestId} = render(<Home />);
    const bottomPickerButton = queryByTestId(/bottomPickerButton/i);
    const bottomPickerList = queryByTestId(/bottomPickerList/i);

    expect(bottomPickerButton).toBeTruthy();
    expect(bottomPickerList).not.toBeTruthy();
    fireEvent.press(bottomPickerButton);
    expect(queryByTestId(/bottomPickerList/i)).toBeTruthy();
  });

  it('show the exceed balance error if input amount go throw the main amount', () => {
    const {queryByTestId, queryByText} = render(<Home />);
    const Exceeds = queryByText(/Exceeds balance/i);
    const topInput = queryByTestId(/topInput/i);

    expect(Exceeds).not.toBeTruthy();
    fireEvent.changeText(topInput, '1000');
    expect(queryByText(/Exceeds balance/i)).toBeTruthy();
  });

  it('disable the Exchange Button if both wallets are the same', () => {
    const {queryByTestId} = render(<Home />);
    const topInput = queryByTestId(/topInput/i);
    const selectedTopWallet = queryByTestId(/selectedTopWallet/i);
    const selectedBottomWallet = queryByTestId(/selectedBottomWallet/i);
    fireEvent.changeText(topInput, '100');
    expect(selectedTopWallet.props.children).toBe(
      selectedBottomWallet.props.children,
    );
    expect(queryByTestId(/ExchangeButton/i)).toBeDisabled();
  });

  it('enable the Exchange Button if input amount is less than main amount and both wallets are not the same', () => {
    const {queryByTestId} = render(<Home />);
    const topInput = queryByTestId(/topInput/i);
    const bottomPickerButton = queryByTestId(/bottomPickerButton/i);

    expect(queryByTestId(/ExchangeButton/i)).toBeDisabled();
    expect(queryByTestId(/bottomPickerList/i)).not.toBeTruthy();
    fireEvent.press(bottomPickerButton);
    expect(queryByTestId(/bottomPickerList/i)).toBeTruthy();
    fireEvent.press(queryByTestId(/bottomItems-1/i));
    fireEvent.changeText(topInput, '100');
    expect(queryByTestId(/ExchangeButton/i)).toBeEnabled();
  });
});

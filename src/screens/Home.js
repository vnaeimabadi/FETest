/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {FONTS, COLORS, SIZES, data, images} from '../constants';
import Icon from 'react-native-remix-icon';
import {getExchangeCurrency} from '../apis';

const Home = () => {
  const [isExchangeButtonActive, setIsExchangeButtonActive] = useState(false);
  const [isExceeded, setIsExceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topInput, setTopInput] = useState('');
  const [bottomInput, setBottomInput] = useState('');
  const [showTopWalletPicker, setShowTopWalletPicker] = useState(false);
  const [showBottomWalletPicker, setShowBottomWalletPicker] = useState(false);
  const [isWalletsChanged, setIsWalletsChanged] = useState(false);
  const [conversionRate, setConversionRate] = useState(1);
  const [balance, setBalance] = useState(data);

  const [topWalletItems, setTopWalletItems] = useState([
    {label: 'USD', symbol: '$', selected: true},
    {label: 'EUR', symbol: '€', selected: false},
    {label: 'GBP', symbol: '£', selected: false},
  ]);
  const [selectedTopWalletItem, setSelectedTopWalletItem] = useState({
    label: 'USD',
    symbol: '$',
    balence: balance[0].balance,
  });

  const [bottomWalletItems, setBottomWalletItems] = useState([
    {label: 'USD', symbol: '$', selected: true},
    {label: 'EUR', symbol: '€', selected: false},
    {label: 'GBP', symbol: '£', selected: false},
  ]);
  const [selectedBottomWalletItem, setSelectedBottomWalletItem] = useState({
    label: 'USD',
    symbol: '$',
    balence: balance[0].balance,
  });

  const validator = /^[+]?\d*(?:[.]\d*)?$/;
  const updateTopInput = text => {
    if (validator.test(text)) {
      setTopInput(text);
      let num = parseFloat(text) * parseFloat(conversionRate + '');
      setBottomInput(text === '' ? '' : Number(num.toFixed(6)) + '');
    }
  };

  const updateBottomInput = text => {
    if (validator.test(text)) {
      setBottomInput(text);
      let num = parseFloat(text) / parseFloat(conversionRate + '');
      setTopInput(text === '' ? '' : Number(num.toFixed(6)) + '');
    }
  };

  const topWalletSection = () => {
    const renderTopWalletCurrencies = () => {
      return topWalletItems.map((element, index) => {
        return (
          <TouchableOpacity
            testID={`topItems-${index}`}
            key={`topSection-${index}`}
            onPress={() => {
              let balanceSelected = balance.find(
                (el, _) => el.label === element.label,
              );
              setShowTopWalletPicker(false);
              setSelectedTopWalletItem({
                label: element.label,
                symbol: element.symbol,
                balence: balanceSelected.balance,
              });
              let temp = topWalletItems.map((item, _) => {
                return item.label === element.label
                  ? {...item, selected: true}
                  : {...item, selected: false};
              });
              setTopWalletItems(temp);
              if (element.label !== selectedBottomWalletItem.label) {
                setIsWalletsChanged(prev => !prev);
              } else {
                if (conversionRate !== 1) setConversionRate(1);
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: SIZES.radius * 0.4,
                backgroundColor: element.selected ? COLORS.blue : 'transparent',
              }}>
              {element.selected && (
                <Icon
                  name="ri-check-line"
                  color={COLORS.white}
                  size={15}
                  style={{marginRight: 5, alignSelf: 'center'}}
                />
              )}
              <Text
                style={{
                  ...FONTS.body4,
                  textAlign: 'center',
                  color: COLORS.white,
                  marginLeft: element.selected ? 0 : 15,
                  marginBottom: 2,
                }}>
                {element.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });
    };
    const renderTopWalletBox = () => {
      return (
        <TouchableOpacity
          testID="topPickerButton"
          style={{flexDirection: 'row', paddingHorizontal: 5}}
          onPress={() => {
            setShowTopWalletPicker(true);
          }}>
          <Text
            testID="selectedTopWallet"
            style={{
              ...FONTS.body3,
              color: COLORS.darkGray,
            }}>
            {selectedTopWalletItem.label}
          </Text>
          <Icon
            name="ri-arrow-down-s-line"
            color={COLORS.darkGray}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      );
    };
    const renderTopWalletBalance = () => {
      return (
        <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 5}}>
          <Text style={{...FONTS.body3}}>Balance:</Text>
          <Text
            style={{
              ...FONTS.body3,
            }}>{`${selectedTopWalletItem.symbol} ${Number(
            selectedTopWalletItem.balence,
          )}`}</Text>
        </View>
      );
    };
    const renderTopWalletInput = () => {
      return (
        <View style={{minHeight: 75, alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Icon
              name="ri-subtract-fill"
              size="30"
              color={COLORS.lightGray}
              style={{alignSelf: 'center'}}
            />
            <TextInput
              testID="topInput"
              keyboardType="number-pad"
              onChangeText={updateTopInput}
              value={topInput}
              style={{
                ...FONTS.body2,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                color: COLORS.darkGray,
                borderBottomColor: COLORS.lightGray,
              }}
            />
          </View>
          {isExceeded && (
            <Text style={{...FONTS.body5, color: COLORS.pink}}>
              Exceeds balance
            </Text>
          )}
        </View>
      );
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryBackGroundColor,
          borderTopStartRadius: SIZES.radius,
          borderTopEndRadius: SIZES.radius,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <View>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              zIndex: 2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderColor: COLORS.darkGray,
                borderWidth: 1,
                width: 65,
              }}>
              {renderTopWalletBox()}
              {showTopWalletPicker && (
                <View
                  testID="topPickerList"
                  style={{
                    position: 'absolute',
                    backgroundColor: COLORS.gray500,
                    borderRadius: SIZES.radius * 0.5,
                    width: 66,
                    zIndex: 10,
                    top: -20,
                    left: -2,
                    color: COLORS.white,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                  }}>
                  {renderTopWalletCurrencies()}
                </View>
              )}
            </View>
          </View>
          {renderTopWalletBalance()}
        </View>
        {renderTopWalletInput()}
      </View>
    );
  };
  const bottomWalletSection = () => {
    const renderBottomWalletCurrencies = () => {
      return bottomWalletItems.map((element, index) => {
        return (
          <TouchableOpacity
            testID={`bottomItems-${index}`}
            key={`bottomSection-${index}`}
            onPress={() => {
              let balanceSelected = balance.find(
                (el, _) => el.label === element.label,
              );
              setShowBottomWalletPicker(false);
              setSelectedBottomWalletItem({
                label: element.label,
                symbol: element.symbol,
                balence: balanceSelected.balance,
              });
              let temp = bottomWalletItems.map((item, _) => {
                return item.label === element.label
                  ? {...item, selected: true}
                  : {...item, selected: false};
              });
              setBottomWalletItems(temp);
              if (element.label !== selectedTopWalletItem.label) {
                setIsWalletsChanged(prev => !prev);
              } else {
                if (conversionRate !== 1) setConversionRate(1);
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: element.selected ? COLORS.blue : 'transparent',
                borderRadius: SIZES.radius * 0.4,
              }}>
              {element.selected && (
                <Icon
                  name="ri-check-line"
                  color={COLORS.white}
                  size={15}
                  style={{marginRight: 5, alignSelf: 'center'}}
                />
              )}
              <Text
                style={{
                  ...FONTS.body4,
                  textAlign: 'center',
                  color: COLORS.white,
                  marginLeft: element.selected ? 0 : 15,
                  marginBottom: 2,
                }}>
                {element.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });
    };
    const renderBottomWalletBox = () => {
      return (
        <TouchableOpacity
          testID="bottomPickerButton"
          style={{flexDirection: 'row', paddingHorizontal: 5}}
          onPress={() => {
            setShowBottomWalletPicker(true);
          }}>
          <Text
            testID="selectedBottomWallet"
            style={{
              ...FONTS.body3,
              color: COLORS.darkGray,
            }}>
            {selectedBottomWalletItem.label}
          </Text>
          <Icon
            name="ri-arrow-down-s-line"
            color={COLORS.darkGray}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      );
    };
    const renderBottomWalletBalance = () => {
      return (
        <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 5}}>
          <Text style={{...FONTS.body3}}>Balance:</Text>
          <Text
            style={{
              ...FONTS.body3,
            }}>{`${selectedBottomWalletItem.symbol} ${Number(
            selectedBottomWalletItem.balence,
          )}`}</Text>
        </View>
      );
    };
    const renderBottomWalletInput = () => {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Icon
            name="ri-add-line"
            size="30"
            color={COLORS.lightGray}
            style={{alignSelf: 'center'}}
          />
          <TextInput
            testID="bottomInput"
            keyboardType="number-pad"
            onChangeText={updateBottomInput}
            value={bottomInput}
            style={{
              ...FONTS.body2,
              borderBottomWidth: 1,
              borderStyle: 'dashed',
              color: COLORS.darkGray,
              borderBottomColor: COLORS.lightGray,
            }}
          />
        </View>
      );
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.secondaryBackGroundColor,
          borderBottomEndRadius: SIZES.radius,
          borderBottomStartRadius: SIZES.radius,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <View>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              zIndex: 2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderColor: COLORS.darkGray,
                borderWidth: 1,
                width: 65,
              }}>
              {renderBottomWalletBox()}

              {showBottomWalletPicker && (
                <View
                  testID="bottomPickerList"
                  style={{
                    position: 'absolute',
                    backgroundColor: COLORS.gray500,
                    borderRadius: SIZES.radius * 0.5,
                    width: 66,
                    zIndex: 10,
                    top: -20,
                    left: -2,
                    color: COLORS.white,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                  }}>
                  {renderBottomWalletCurrencies()}
                </View>
              )}
            </View>
          </View>
          {renderBottomWalletBalance()}
        </View>
        {renderBottomWalletInput()}
      </View>
    );
  };

  const reset = () => {
    setTopInput('');
    setBottomInput('');
    setIsExceeded(false);
    setIsExchangeButtonActive(false);
  };

  const exchangeHandler = () => {
    if (selectedTopWalletItem.label === selectedBottomWalletItem.label) return;
    let finalBalance = balance.map((el, _) => {
      if (el.label === selectedTopWalletItem.label) {
        return {
          ...el,
          balance: (parseFloat(el.balance + '') - parseFloat(topInput)).toFixed(
            6,
          ),
        };
      } else if (el.label === selectedBottomWalletItem.label) {
        return {
          ...el,
          balance: (
            parseFloat(el.balance + '') + parseFloat(bottomInput)
          ).toFixed(6),
        };
      }
      return el;
    });
    setBalance(finalBalance);
    setSelectedTopWalletItem(prev => ({
      ...prev,
      balence: (parseFloat(prev.balence + '') - parseFloat(topInput)).toFixed(
        6,
      ),
    }));
    setSelectedBottomWalletItem(prev => ({
      ...prev,
      balence: (
        parseFloat(prev.balence + '') + parseFloat(bottomInput)
      ).toFixed(6),
    }));

    reset();
  };
  const fetchConversionRate = async () => {
    let apikey = 'd352c8b0-74ac-11ec-a918-7bf9075c6608';
    let from = selectedTopWalletItem.label;
    let to = selectedBottomWalletItem.label;
    if (from === to) {
      setConversionRate(1);
    } else {
      try {
        setLoading(true);
        let url = `https://freecurrencyapi.net/api/v2/latest?apikey=${apikey}&base_currency=${from}`;
        const response = await getExchangeCurrency(url);
        const currenciesList = await response.json();
        setConversionRate(currenciesList.data[`${to}`]);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    reset();
    fetchConversionRate();
  }, [isWalletsChanged]);

  useEffect(() => {
    let disableButton = false;
    let exceeded = false;

    if (
      topInput === '' ||
      bottomInput === '' ||
      selectedTopWalletItem.label === selectedBottomWalletItem.label
    ) {
      if (
        topInput !== '' &&
        parseFloat(topInput) > parseFloat(selectedTopWalletItem.balence)
      ) {
        exceeded = true;
      }
      disableButton = true;
    } else {
      if (parseFloat(topInput) > parseFloat(selectedTopWalletItem.balence)) {
        disableButton = true;
        exceeded = true;
      }
    }

    if (disableButton) {
      if (isExchangeButtonActive) {
        setIsExchangeButtonActive(false);
      }
    } else {
      if (!isExchangeButtonActive) {
        setIsExchangeButtonActive(true);
      }
    }
    if (exceeded) {
      if (!isExceeded) {
        setIsExceeded(true);
      } else {
        if (isExceeded) {
          setIsExceeded(false);
        }
      }
    } else {
      if (isExceeded) {
        setIsExceeded(false);
      }
    }
  }, [topInput, bottomInput]);

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: SIZES.width * 0.85,
        }}>
        <Text style={{...FONTS.h3, color: COLORS.lightGray}}>
          Currency Exchange Prototype
        </Text>
        <Image
          source={images.Transactions}
          style={{height: 30, width: 45, resizeMode: 'contain'}}
        />
      </View>
    );
  };
  const renderConversionRate = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: SIZES.height * 0.225,
          alignItems: 'center',
        }}>
        <View
          style={{
            borderColor: COLORS.green,
            borderWidth: 2,
            borderRadius: SIZES.radius * 2,
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: COLORS.white,
            minWidth: 150,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...FONTS.body4,
            }}>
            {`${selectedTopWalletItem.symbol} 1`}
          </Text>
          <Text
            style={{
              ...FONTS.body4,
              marginHorizontal: 5,
            }}>
            =
          </Text>
          <Text
            style={{
              ...FONTS.body4,
            }}>
            {`${selectedBottomWalletItem.symbol} ${conversionRate}`}
          </Text>
        </View>
      </View>
    );
  };
  const renderRightSideIcon = () => {
    return (
      <View
        style={{
          position: 'absolute',
          right: -25,
          top: SIZES.height * 0.215,
          alignItems: 'center',
        }}>
        <View
          style={{
            borderColor: COLORS.mainBackGroundColor,
            borderWidth: 3,
            borderRadius: SIZES.radius * 2,
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: COLORS.primaryBackGroundColor,
            minWidth: 50,
            height: 50,
            justifyContent: 'center',
          }}>
          <Icon
            name="ri-arrow-up-down-line"
            size="20"
            color={COLORS.mainBackGroundColor}
            style={{alignSelf: 'center'}}
          />
        </View>
      </View>
    );
  };
  const renderBody = () => {
    return (
      <View
        style={{
          height: SIZES.height * 0.5,
          marginVertical: 10,
          position: 'relative',
        }}>
        {topWalletSection()}

        {bottomWalletSection()}

        {renderConversionRate()}

        {renderRightSideIcon()}
      </View>
    );
  };
  const renderExchangeButton = () => {
    return (
      <View
        style={{
          alignSelf: 'flex-start',
        }}>
        <TouchableOpacity
          testID="ExchangeButton"
          disabled={isExchangeButtonActive ? false : true}
          style={{
            backgroundColor: COLORS.pink,
            borderRadius: SIZES.radius * 0.4,
            opacity: isExchangeButtonActive ? 1 : 0.5,
          }}
          onPress={exchangeHandler}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}>
            Exchange
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderLoadingIcon = () => {
    return (
      loading && (
        <View
          style={{
            backgroundColor: COLORS.transparentBlack,
            height: '100%',
            width: '100%',
            flex: 1,
            position: 'absolute',
            justifyContent: 'center',
            borderRadius: SIZES.radius * 0.4,
          }}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      )
    );
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          height: SIZES.height,
          width: SIZES.width,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.mainBackGroundColor,
        }}>
        <View style={{width: SIZES.width * 0.85}}>
          {renderHeader()}
          {renderBody()}
          {renderExchangeButton()}
        </View>
        {renderLoadingIcon()}
      </ScrollView>
    </View>
  );
};

export default Home;

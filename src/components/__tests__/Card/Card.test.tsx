import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { render } from '@testing-library/react-native';
import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../../core/theming';
import { black, white } from '../../../styles/themes/v2/colors';
import { MD3Colors } from '../../../styles/themes/v3/tokens';
import Button from '../../Button/Button';
import Card from '../../Card/Card';
import { getCardColors, getCardCoverStyle } from '../../Card/utils';

const styles = StyleSheet.create({
  customBorderRadius: {
    borderRadius: 32,
  },
});

describe('Card', () => {
  it('renders an outlined card', () => {
    const tree = renderer.create(<Card mode="outlined">{null}</Card>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders an outlined card with custom border radius and color', () => {
    const { getByTestId } = render(
      <Card
        mode="outlined"
        theme={{ colors: { outline: 'purple' } }}
        style={styles.customBorderRadius}
      >
        {null}
      </Card>
    );

    expect(getByTestId('card-outline')).toHaveStyle({
      borderRadius: 32,
      borderColor: 'purple',
    });
  });

  it('renders an outlined card with custom border color', () => {
    const { getByLabelText } = render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        style={{ borderColor: MD3Colors.error50 }}
      >
        {null}
      </Card>
    );

    expect(getByLabelText('card')).toHaveStyle({
      borderColor: MD3Colors.error50,
    });
  });

  it('renders with a custom theme', () => {
    const { getByLabelText } = render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        theme={{ colors: { surface: '#0000FF' } }}
      >
        {null}
      </Card>
    );

    expect(getByLabelText('card')).toHaveStyle({
      backgroundColor: '#0000FF',
    });
  });
});

describe('CardActions', () => {
  it('renders button with passed mode', () => {
    const { getByTestId } = render(
      <Card>
        <Card.Actions testID="card-actions">
          <Button mode="contained">Agree</Button>
        </Card.Actions>
      </Card>
    );

    expect(getByTestId('card-actions').props.children[0].props.mode).toBe(
      'contained'
    );
  });
});

describe('getCardColors - background color', () => {
  it('should return correct theme color, for theme version 3, contained mode', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({ backgroundColor: getTheme().colors.surface });
  });

  it('should return undefined, for theme version 3, elevated mode', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: 'elevated',
      })
    ).toMatchObject({ backgroundColor: undefined });
  });

  it('should return undefined, for theme version 2', () => {
    expect(
      getCardColors({
        theme: getTheme(false, false),
        mode: undefined as any,
      })
    ).toMatchObject({ backgroundColor: undefined });
  });
});

describe('getCardColors - border color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: undefined as any,
      })
    ).toMatchObject({ borderColor: getTheme().colors.outline });
  });

  it('should return correct color, for theme version 2, dark mode', () => {
    expect(
      getCardColors({
        theme: getTheme(true, false),
        mode: undefined as any,
      })
    ).toMatchObject({
      borderColor: color(white).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct color, for theme version 2, light mode', () => {
    expect(
      getCardColors({
        theme: getTheme(false, false),
        mode: undefined as any,
      })
    ).toMatchObject({
      borderColor: color(black).alpha(0.12).rgb().string(),
    });
  });
});

describe('getCardCoverStyle - border radius', () => {
  it('should return correct border radius based on roundness, for theme version 3', () => {
    expect(
      getCardCoverStyle({
        theme: getTheme(),
      })
    ).toMatchObject({ borderRadius: 3 * getTheme().roundness });
  });

  it('should return correct border radius based on roundness, for theme version 2, when index is 0 and total is 1', () => {
    expect(
      getCardCoverStyle({
        theme: getTheme(false, false),
        index: 0,
        total: 1,
      })
    ).toMatchObject({ borderRadius: getTheme(false, false).roundness });
  });

  it('should return correct border radius based on roundness, for theme version 2, when index is 0 and total is other than 1', () => {
    expect(
      getCardCoverStyle({
        theme: getTheme(false, false),
        index: 0,
        total: 2,
      })
    ).toMatchObject({
      borderTopLeftRadius: getTheme(false, false).roundness,
      borderTopRightRadius: getTheme(false, false).roundness,
    });
  });

  it('should return correct border radius based on roundness, for theme version 2, when index is equal to total - 1', () => {
    expect(
      getCardCoverStyle({
        theme: getTheme(false, false),
        index: 1,
        total: 2,
      })
    ).toMatchObject({
      borderBottomLeftRadius: getTheme(false, false).roundness,
    });
  });
});

it('animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
    <Card
      mode="outlined"
      accessibilityLabel="card"
      style={[{ transform: [{ scale: value }] }]}
    >
      {null}
    </Card>
  );
  expect(getByTestId('card-container')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  jest.advanceTimersByTime(200);

  expect(getByTestId('card-container')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

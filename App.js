import React, {Component} from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {ActivityIndicator, NativeModules, StyleSheet, View} from 'react-native';
import { Provider } from 'react-redux';
import axios from 'axios';
import Router from './router';
import tasksReducer from './src/store/reducers/tasks';
import cateReducer from './src/store/reducers/categories';
import themeReducer from './src/store/reducers/theme';
import settingsReducer from './src/store/reducers/settings';
import thunk from 'redux-thunk';
import { SQLite } from 'expo';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import {onInitTheme} from "./src/store/actions/theme";

const VERSION = '0.5.0B';

const UIManager = NativeModules.UIManager;

// Init DB
const db = SQLite.openDatabase('maker.db');

axios.defaults.baseURL = "https://todo-56c42.firebaseio.com/"; // Default Axios URL

const rootReducer = combineReducers({
    tasks: tasksReducer,
    categories: cateReducer,
    theme: themeReducer,
    settings: settingsReducer
});

const store = createStore(rootReducer, (
    applyMiddleware(thunk)
));

class App extends Component {
    state = {
        uiTheme: false,
        ready: false
    };

    componentDidMount() {
        this.initDatabase();
    }

    initDatabase = () => {
        db.transaction(tx => {
/*            tx.executeSql(
                'DROP TABLE IF EXISTS tasks;'
            );
            tx.executeSql(
                'DROP TABLE IF EXISTS finished;'
            );
            tx.executeSql(
                'DROP TABLE IF EXISTS categories;'
            );
            tx.executeSql(
                'DROP TABLE IF EXISTS themes;'
            );
            tx.executeSql(
                'DROP TABLE IF EXISTS settings;'
            );*/
            tx.executeSql(
                'create table if not exists categories (id integer primary key not null, name text);'
            );
            tx.executeSql(
                'create table if not exists tasks (id integer primary key not null, name text, description text, date text, category text, priority text, repeat text);'
            );
            tx.executeSql(
                'create table if not exists finished (id integer primary key not null, name text, description text, date text, category text, priority text, repeat text, finish integer);'
            );
            tx.executeSql(
                'create table if not exists themes (id integer primary key not null, name text, primaryColor text, primaryBackgroundColor text, secondaryBackgroundColor text, textColor text, headerTextColor text, bottomNavigationColor text, actionButtonColor text, actionButtonIconColor text, overdueColor text, doneButtonColor text, doneButtonTextColor text, undoButtonColor text, undoButtonTextColor text, noneColor text, noneTextColor text, lowColor text, lowTextColor text, mediumColor text, mediumTextColor text, highColor text, highTextColor text);'
            );
            tx.executeSql(
                'create table if not exists settings (id integer primary key not null, sorting text, sortingType text, timeFormat integer, firstDayOfWeek text, confirmFinishingTask integer, confirmRepeatingTask integer, confirmDeletingTask integer, version text, theme integer DEFAULT 0 REFERENCES themes(id) ON DELETE SET DEFAULT);'
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO categories (id, name) values (0, 'Default');"
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO themes (id, name, primaryColor, primaryBackgroundColor, secondaryBackgroundColor, textColor, headerTextColor, bottomNavigationColor, actionButtonColor, actionButtonIconColor, overdueColor, doneButtonColor, doneButtonTextColor, undoButtonColor, undoButtonTextColor, noneColor, noneTextColor, lowColor, lowTextColor, mediumColor, mediumTextColor, highColor, highTextColor) values (0, 'Default', '#f4511e', '#ffffff', '#e5e5e5', '#666', '#ffffff', '#ffffff', '#f4133f', '#ffffff', '#ce3241', '#26b596', '#ffffff', '#5bc0de', '#ffffff', '#ffffff', '#000000', '#26b596', '#ffffff', '#cec825', '#ffffff', '#ce3241', '#ffffff');"
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO themes (id, name, primaryColor, primaryBackgroundColor, secondaryBackgroundColor, textColor, headerTextColor, bottomNavigationColor, actionButtonColor, actionButtonIconColor, overdueColor, doneButtonColor, doneButtonTextColor, undoButtonColor, undoButtonTextColor, noneColor, noneTextColor, lowColor, lowTextColor, mediumColor, mediumTextColor, highColor, highTextColor) values (1, 'Dark', '#a33f3f', '#845252', '#707070', '#ffffff', '#ffffff', '#282828', '#a33f3f', '#ffffff', '#ce3241', '#26b596', '#ffffff', '#5bc0de', '#ffffff', '#ffffff', '#000000', '#26b596', '#ffffff', '#cec825', '#ffffff', '#ce3241', '#ffffff');"
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO settings (id, sorting, sortingType, timeFormat, firstDayOfWeek, confirmFinishingTask, confirmRepeatingTask, confirmDeletingTask, version, theme) values (0, 'byAZ', 'ASC', 1, 'Sunday', 1, 1, 1, '0.5.0B', 0);"
            );
        }, (err) => {
            console.warn(err);
            this.initApp();
        }, () => this.initApp());
    };

    initApp = () => {
        let version;
        db.transaction(
            tx => {
                // CHECK CORRECTION APP VERSION
                tx.executeSql("select version from settings", [], (_, {rows}) => {
                    version = rows._array[0].version;
                    if (version !== VERSION) {
                        tx.executeSql('DROP TABLE IF EXISTS settings;');
                        this.initDatabase();
                    }
                }, (err) => {
                    console.warn(err);
                    tx.executeSql('DROP TABLE IF EXISTS settings;', [], () => this.initDatabase());
                });
                // INIT THEME
                tx.executeSql("select theme from settings", [], (_, {rows}) => {
                    tx.executeSql('select * from themes where id = ?', [rows._array[0].theme], (_, {rows}) => {
                        const theme = rows._array[0];
                        this.setState({
                            uiTheme: {
                                palette: {
                                    primaryColor: theme.primaryColor,
                                    accentColor: theme.actionButtonColor,
                                    primaryTextColor: theme.textColor,
                                    secondaryTextColor: theme.textColor,
                                    alternateTextColor: theme.headerTextColor,
                                    disabledColor: theme.textColor,
                                    pickerHeaderColor: theme.textColor
                                },
                            },
                            ready: true
                        });
                    });
                });
            }, (err) => console.warn(err)
        );
    };

    componentWillMount() {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    render() {
        const { uiTheme, ready } = this.state;

        return (
            ready ?
            <Provider store={store}>
                <ThemeContext.Provider value={getTheme(uiTheme)}>
                    <Router />
                </ThemeContext.Provider>
            </Provider> :
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 50
    }
});

export default App;
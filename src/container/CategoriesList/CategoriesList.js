import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Toolbar, IconToggle, ListItem} from 'react-native-material-ui';
import ConfigCategory from '../ConfigCategory/ConfigCategory';
import Template from '../Template/Template';

import { connect } from 'react-redux';
import * as actions from "../../store/actions";

class TaskList extends Component {
    state = {
        showModal: false,
        refresh: false,
        selectedCategory: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props || prevProps.refresh !== this.props.refresh) {
            this.setState({ refresh: this.props.refresh });
        }
    }

    toggleModalHandler = (selected) => {
        const { showModal } = this.state;
        if (selected) this.setState({ showModal: !showModal });
        else this.setState({ showModal: !showModal, selectedCategory: false });
    };

    render() {
        const {showModal, selectedCategory} = this.state;
        const {categories, navigation} = this.props;

        return (
            <Template>
                <Toolbar
                    leftElement="arrow-back"
                    rightElement={
                        <IconToggle color="white" onPress={() => this.toggleModalHandler(false)} name="add" />
                    }
                    onLeftElementPress={() => {
                        this.props.onDefaultCategory();
                        navigation.goBack();
                    }}
                    centerElement='Categories'
                />
                <ConfigCategory
                    showModal={showModal}
                    editCategory={selectedCategory}
                    toggleModal={this.toggleModalHandler}
                />
                <View style={styles.container}>
                    <ScrollView style={styles.categories}>
                        {categories.map(cate => (
                            <ListItem
                                divider
                                dense
                                key={cate.id}
                                onPress={() => {
                                    this.setState({ selectedCategory: cate });
                                    this.toggleModalHandler(true)
                                }}
                                rightElement={
                                    cate.id !== 0 ?
                                    <IconToggle onPress={() => this.props.onRemoveCategory(cate.id)} name="remove" /> : false
                                }
                                centerElement={{
                                    primaryText: `${cate.name}`,
                                }}
                            />
                        ))}
                    </ScrollView>
                </View>
            </Template>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    categories: {
        width: "100%",
    },
});

const mapStateToProps = state => {
    return {
        categories: state.categories.categories,
        refresh: state.tasks.refresh,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onRemoveCategory: (id) => dispatch(actions.removeCategory(id)),
        onDefaultCategory: () => dispatch(actions.defaultCategory()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
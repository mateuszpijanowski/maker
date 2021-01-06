import {Platform} from 'react-native'

// GLOBAL STYLES

export const flex = {
	flex: 1,
}

export const listRow = {
	backgroundColor: '#fff',
	marginTop: 5,
	marginBottom: 10,
	marginLeft: 10,
	marginRight: 10,
	height: 50,
}

export const activity = {
	flex: 1,
	alignItems: 'center',
	flexDirection: 'row',
	justifyContent: 'space-around',
	padding: 50,
}

export const empty = {
	marginTop: 30,
	width: '100%',
	textAlign: 'center',
}

export const foundResults = {
	marginLeft: 15,
	position: 'relative',
	zIndex: 100,
	marginTop: Platform.OS === 'ios' ? -5 : 10,
	paddingBottom: 5,
}

export const settingsHeading = {
	color: '#009688',
}

export const shadow = {
	shadowColor: '#000',
	shadowOffset: {
		width: 2,
		height: 2,
	},
	shadowOpacity: 0.25,
	shadowRadius: 5,
	elevation: 7,
}

export const separator = {
	flex: 1,
	width: '100%',
	height: 1,
	marginLeft: 15,
	marginRight: 15,
	backgroundColor: '#E4E4E4',
}

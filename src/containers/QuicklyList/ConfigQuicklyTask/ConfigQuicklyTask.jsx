import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from '../../../components/UI/Dialog/Dialog'
import { generateDialogObject } from '../../../shared/utility'

import * as actions from '../../../store/actions'

class ConfigQuicklyTask extends Component {
	state = {
		task: {
			id: false,
			name: '',
			order_nr: null,
			list_id: false,
		},
		control: {
			label: this.props.translations.quicklyTaskName,
			required: true,
			characterRestriction: 40,
		},
		dialog: false,
	}

	componentDidMount() {
		const { task_id } = this.props

		this.initQuicklyTask(task_id)
	}

	initQuicklyTask = (task_id) => {
		const { translations } = this.props

		if (task_id !== false) {
			const { onInitQuicklyTask } = this.props

			onInitQuicklyTask(task_id, (res) => {
				this.setState({ task: res })
				this.showDialog(translations.editTask)
			})
		} else {
			this.setState({
				task: {
					id: false,
					name: '',
					order_nr: null,
					list_id: false,
				},
			})
			this.showDialog(translations.newTask)
		}
	}

	showDialog = (title) => {
		const { task, control } = this.state
		const { toggleModal } = this.props

		const dialog = generateDialogObject(
			title,
			{
				elementConfig: control,
				focus: true,
				value: task.name,
				onChange: (value, control) => {
					const { task } = this.state
					task.name = value
					this.setState({ task, control }, () => {
						this.showDialog(title)
					})
				},
			},
			{
				Save: () => {
					const { control } = this.state
					const { list, taskLength, onSaveQuicklyTask } = this.props
					if (!control.error) {
						if (task.order_nr === null) {
							task.order_nr = taskLength
						}
						onSaveQuicklyTask(task, list, (list) => {
							toggleModal(task, list)
						})
					}
				},
				Cancel: toggleModal,
			},
		)
		this.setState({ dialog })
	}

	render() {
		const { dialog } = this.state
		const { showModal } = this.props

		return (
			<>
				{dialog && (
					<Dialog
						showModal={showModal}
						input
						title={dialog.title}
						body={dialog.body}
						buttons={dialog.buttons}
					/>
				)}
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	translations: {
		...state.settings.translations.ConfigQuicklyTask,
		...state.settings.translations.validation,
	},
})
const mapDispatchToProps = (dispatch) => ({
	onInitQuicklyTask: (id, callback) => dispatch(actions.initQuicklyTask(id, callback)),
	onSaveQuicklyTask: (task, list, callback) =>
		dispatch(actions.saveQuicklyTask(task, list, callback)),
})
export default connect(mapStateToProps, mapDispatchToProps)(ConfigQuicklyTask)

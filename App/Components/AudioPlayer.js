import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Chip, ProgressBar } from 'react-native-paper';
import styles from './Styles/AudioPlayerStyle';
import Sound from 'react-native-sound';
import { Colors } from '../Themes';
class AudioPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0,
			currentTime: 0,
			duration: 0,
			disabled: false
		};
	}
	componentWillMount() {
		this.track = null;
	}

	playTrack = () => {
		this.setState({
			disabled: true
		});
		tick = () => {
			this.track.getCurrentTime((seconds) => {
				if (this.tickInterval) {
					this.setState({
						currentTime: seconds,
						progress: seconds / this.track.getDuration()
					});
				}
			});
		};
		this.track = new Sound(this.props.record, null, (e) => {
			if (e) {
				console.warn('error loading track:', e);
				return;
			} else {
				this.tickInterval = setInterval(() => {
					tick();
				}, 250);
				// loaded successfully
				this.track.play((success) => {
					if (success) {
						if (this.tickInterval) {
							clearInterval(this.tickInterval);
							this.tickInterval = null;
						}
						console.warn('successfully finished playing');
						this.setState({
							disabled: false
						});
					} else {
						if (this.tickInterval) {
							clearInterval(this.tickInterval);
							this.tickInterval = null;
						}
						console.warn('playback failed due to audio decoding errors');
					}
				});
			}
		});
	};

	render() {
		return (
			<View style={styles.audioPlayerContainer}>
				<ProgressBar
					theme={{
						colors: {
							primary: Colors.secondary,
							accent: Colors.primary
						}
					}}
					style={styles.progressBar}
					progress={this.state.progress}
					color={Colors.primary}
				/>
				<Chip
					disabled={this.state.disabled}
					onPress={this.playTrack}
					theme={{
						colors: {
							text: '#fff'
						}
					}}
					style={styles.playChip}
					icon="play-arrow"
				>
					شغل
				</Chip>
			</View>
		);
	}
}

export default AudioPlayer;

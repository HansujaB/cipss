import { Share, Platform } from 'react-native';

export const shareAchievement = async (achievement, userProgress) => {
  const message = `🏆 I just unlocked "${achievement.name}" on CIPSS!

${achievement.description}
+${achievement.points} points earned

Join me in making a difference! 🌍
#CIPSS #SocialImpact #Achievement`;

  try {
    await Share.share({
      message,
      url: Platform.OS === 'ios' ? 'https://cipss.app' : undefined,
      title: 'Achievement Unlocked!',
    });
    return true;
  } catch (error) {
    console.error('Error sharing achievement:', error);
    return false;
  }
};

export const shareRank = async (userRank, userName, points) => {
  const message = `🎯 I'm ranked #${userRank} on the CIPSS leaderboard!

${points} points earned through social impact campaigns
Join the movement and make a difference! 💚

#CIPSS #Leaderboard #SocialImpact`;

  try {
    await Share.share({
      message,
      url: Platform.OS === 'ios' ? 'https://cipss.app' : undefined,
      title: 'Leaderboard Rank!',
    });
    return true;
  } catch (error) {
    console.error('Error sharing rank:', error);
    return false;
  }
};

export const shareProfile = async (user) => {
  const message = `👤 Check out my CIPSS profile!

Name: ${user.name}
Rank: #${user.rank}
Points: ${user.points}
Campaigns: ${user.campaigns}
Badges: ${user.badges.join(' ')}

${user.impact || 'Making a difference!'}

Join me in creating social impact! 🌍
#CIPSS #SocialImpact #Community`;

  try {
    await Share.share({
      message,
      url: Platform.OS === 'ios' ? 'https://cipss.app' : undefined,
      title: 'My CIPSS Profile',
    });
    return true;
  } catch (error) {
    console.error('Error sharing profile:', error);
    return false;
  }
};

export const shareCampaign = async (campaign) => {
  const message = `🤝 Support this amazing campaign on CIPSS!

"${campaign.title}"
${campaign.description}

Goal: ₹${campaign.goal.toLocaleString()}
Raised: ₹${campaign.raised.toLocaleString()}

Help make a difference! 💚
#CIPSS #Campaign #Fundraising #SocialImpact`;

  try {
    await Share.share({
      message,
      url: Platform.OS === 'ios' ? 'https://cipss.app' : undefined,
      title: 'Support this Campaign',
    });
    return true;
  } catch (error) {
    console.error('Error sharing campaign:', error);
    return false;
  }
};

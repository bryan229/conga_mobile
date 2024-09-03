#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

// Jaon: add notification badge on App Icon
#import <UserNotifications/UNUserNotificationCenter.h>
@interface AppDelegate : RCTAppDelegate <UNUserNotificationCenterDelegate>

@end

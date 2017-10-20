Surviving on shield island

You are a wizened and skillful dev.  Perhaps you have built a .9999% uptime website serving millions of users, or you built the firefox awesomebar.... but can you SURVIVE SHIELD ISLAND?

> Inventory

- Firefox nightly, firefox beta, firefox (release)
- npm
- git / github


> Look

DARK CLOUDS block the sun.

On the beach is a HANDBOOK here.


> examine dark clouds

As you look up, a light rain starts to fall.  You wonder how you will make a fire to keep warm, as your clothes start to soak.  The first chills of hypothermia ripple your flesh.

> x handbook.

(taking handbook)

SURVIVAL IN HARD ENVIROMENTS

by Lief Savor

Remember that your SURVIVAL GOAL is to...

Get DATA to Telemetry
About user actions
so that you can make decisions about WHICH APPROACH.


## Telemetry First Development

Everything in a SHIELD STUDY leads to allowing ANALYSTS to get data quickly, reliably, and consistently so that they can do analysis of this form:

- for Which VARIATION of a feature
- did users 'do best'.

Your SHIELD-STUDY Legacy Addon is a DELIVERY MECHANISM to collect that data.


An example analysis table

An exmple telemetry `shield-study-addon` probe that contributes to that.

Here is the SQL.


## But I like making User Interface?

Don't we all?!  Mocks are fun!  Styling is fun!

starting with Telemetry makes soe of the... unexpected decisions make sense.

## Wait, did you say legacy addon?

Yes.  Web Extensions CAN'T SEND TELEMETRY.  We need Firefox (chrome) privileges to access the `TelemetryController.jsm`.  That meanss

> make webExtension

Good idea, for some UI's.

## But I have been buildling UI in pure Legacy Extensions since Firefox 2.

Awesome work!  Firebug was awesome.  You have no further use of this guide, and should go to [TODO:Shield-Studies-Addon-Utils-api.md].











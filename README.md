# CIS Identity Resolution Prototype

Interactive static prototype for an accountable identity-resolution flow.

## What It Includes

- Identity Resolution Queue browse mode
- Suspected duplicate selection state
- Bottom summary pane with matching datapoints
- Resolve flow with progressive disclosure
- Primary name selection
- Alias follow-up
- Primary A-number selection
- Consolidated A-number follow-up
- Notes field for final evaluator review
- Send for Final Review loading/submitted state
- Return-to-queue pending review state
- Photo viewer overlay
- EAD card overlay

## Run Locally

Open `index.html` in a browser.

No build step is required.

Useful demo entry points:

- `index.html` queue/browse mode
- `index.html#selected` selected duplicate with summary bar
- `index.html#resolve` resolve workflow start
- `index.html#resolve-name` primary name selected
- `index.html#resolve-a` primary name and A-number selected
- `index.html#photo` photo evidence overlay
- `index.html#ead` EAD evidence overlay
- `index.html#pending` return-to-queue pending review state

## GitHub Pages

This project is ready to serve as a plain static site from GitHub Pages at:

`https://adamrotmil.github.io/cis-id-resolution/`

## Demo Framing

The flow is designed around accountable ambiguity:

The officer can identify a likely duplicate, package the reasoning, choose the primary record, and escalate it without the interface pretending the decision is automatically final.

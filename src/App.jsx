import { useState, useRef, useEffect } from "react";
import { LISTINGS } from "./data.js";

const DM_LOGO = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NjYuOTMgMTE3LjE4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6Izk3MWE2OTt9LmNscy0ye2ZpbGw6I2U5OGEwMDt9LmNscy0ze2ZpbGw6IzMzMzt9LmNscy00e2ZpbGw6I2U4NGUxYjt9LmNscy01e2ZpbGw6IzAxNjg5Yjt9LmNscy02e2ZpbGw6I2M0MTMxNTt9LmNscy03e2ZpbGw6IzdmODA4MDt9LmNscy04e2ZpbGw6IzIyMjMyMzt9LmNscy05e2ZpbGw6bm9uZTt9LmNscy0xMHtmaWxsOiMwMDk3Y2M7fS5jbHMtMTF7ZmlsbDojZGY0YTBlO308L3N0eWxlPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMS0yIj48Zz48Zz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik01Mi43Nyw5MS40NmMtNS44MywwLTEwLjU3LDQuNzQtMTAuNTcsMTAuNTdzNC43NCwxMC41NywxMC41NywxMC41NywxMC41Ny00Ljc0LDEwLjU3LTEwLjU3LTQuNzQtMTAuNTctMTAuNTctMTAuNTdaIi8+PHBhdGggY2xhc3M9ImNscy05IiBkPSJNOTAuNCw2OS43NGMtNS44MywwLTEwLjU3LDQuNzQtMTAuNTcsMTAuNTdzNC43NCwxMC41NywxMC41NywxMC41NywxMC41Ny00Ljc0LDEwLjU3LTEwLjU3LTQuNzQtMTAuNTctMTAuNTctMTAuNTdaIi8+PHBhdGggY2xhc3M9ImNscy0xMCIgZD0iTTY4LjA5LDkwLjU1Yy0xLjg0LDEuMDYtNC4zOSwuNzItNi40OC0uNzktMi41OS0xLjg4LTUuNjUtMi44Ny04Ljg0LTIuODctOC4zNSwwLTE1LjE1LDYuNzktMTUuMTUsMTUuMTVzNi44LDE1LjE1LDE1LjE1LDE1LjE1LDE1LjE1LTYuNzksMTUuMTUtMTUuMTVjMC0uNDgtLjAyLS45Ny0uMDctMS40NC0uMi0yLjEyLC4zNi00LjgzLDIuNTQtNi4wOWw4LjE4LTQuNzNjLS45NS0xLjE5LTEuNzMtMi41Mi0yLjI5LTMuOTdsLTguMiw0Ljc0Wm0tMTUuMzIsMjIuMDZjLTUuODMsMC0xMC41Ny00Ljc0LTEwLjU3LTEwLjU3czQuNzQtMTAuNTcsMTAuNTctMTAuNTcsMTAuNTcsNC43NCwxMC41NywxMC41Ny00Ljc0LDEwLjU3LTEwLjU3LDEwLjU3WiIvPjxwYXRoIGNsYXNzPSJjbHMtOSIgZD0iTTUyLjkxLDQ4LjAyYy01LjgzLDAtMTAuNTcsNC43NS0xMC41NywxMC41N3M0Ljc0LDEwLjU3LDEwLjU3LDEwLjU3LDEwLjU3LTQuNzQsMTAuNTctMTAuNTctNC43NC0xMC41Ny0xMC41Ny0xMC41N1oiLz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik0xNS4xNSwyNi4zYy01LjgzLDAtMTAuNTcsNC43NC0xMC41NywxMC41N3M0Ljc0LDEwLjU3LDEwLjU3LDEwLjU3LDEwLjU3LTQuNzQsMTAuNTctMTAuNTctNC43NC0xMC41Ny0xMC41Ny0xMC41N1oiLz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik01Mi43Nyw0LjU4Yy01LjgzLDAtMTAuNTcsNC43NC0xMC41NywxMC41N3M0Ljc0LDEwLjU3LDEwLjU3LDEwLjU3LDEwLjU3LTQuNzQsMTAuNTctMTAuNTctNC43NC0xMC41Ny0xMC41Ny0xMC41N1oiLz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik00LjU4LDgwLjMxYzAsNS44Myw0Ljc0LDEwLjU3LDEwLjU3LDEwLjU3czEwLjU3LTQuNzQsMTAuNTctMTAuNTctNC43NC0xMC41Ny0xMC41Ny0xMC41Ny0xMC41Nyw0Ljc0LTEwLjU3LDEwLjU3WiIvPjxwYXRoIGNsYXNzPSJjbHMtOSIgZD0iTTkwLjQsNjkuNzRjLTUuODMsMC0xMC41Nyw0Ljc0LTEwLjU3LDEwLjU3czQuNzQsMTAuNTcsMTAuNTcsMTAuNTcsMTAuNTctNC43NCwxMC41Ny0xMC41Ny00Ljc0LTEwLjU3LTEwLjU3LTEwLjU3WiIvPjxwYXRoIGNsYXNzPSJjbHMtOSIgZD0iTTEwMC45NywzNi44N2MwLTUuODMtNC43NC0xMC41Ny0xMC41Ny0xMC41N3MtMTAuNTcsNC43NC0xMC41NywxMC41Nyw0Ljc0LDEwLjU3LDEwLjU3LDEwLjU3LDEwLjU3LTQuNzQsMTAuNTctMTAuNTdaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTIuODYsNTEuODN2OS40N2MwLDIuMTMtMS41Miw0LjEtNC4wNyw1LjI4LTUuMzQsMi40Ny04Ljc5LDcuODctOC43OSwxMy43MywwLDguMzYsNi44LDE1LjE2LDE1LjE1LDE1LjE2czE1LjE1LTYuOCwxNS4xNS0xNS4xNmMwLTUuODctMy40NS0xMS4yNi04Ljc5LTEzLjczLTIuNTUtMS4xOC00LjA3LTMuMTYtNC4wNy01LjI4di05LjQ1Yy0uNzUsLjExLTEuNTIsLjE4LTIuMjksLjE4cy0xLjU0LS4wOC0yLjI5LS4xOVptMTIuODYsMjguNDljMCw1LjgzLTQuNzQsMTAuNTctMTAuNTcsMTAuNTdzLTEwLjU3LTQuNzQtMTAuNTctMTAuNTcsNC43NC0xMC41NywxMC41Ny0xMC41NywxMC41Nyw0Ljc0LDEwLjU3LDEwLjU3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMTEiIGQ9Ik0zMi43OCw0NC40MWMtMi4xOS0xLjI2LTIuNzUtMy45Ny0yLjU0LTYuMDksLjA0LS40OCwuMDctLjk2LC4wNy0xLjQ0LDAtOC4zNi02Ljc5LTE1LjE1LTE1LjE1LTE1LjE1UzAsMjguNTIsMCwzNi44N2MwLDcuNTcsNS41OSwxMy44NCwxMi44NiwxNC45NSwuNzUsLjExLDEuNTEsLjE5LDIuMjksLjE5czEuNTQtLjA2LDIuMjktLjE4YzIuMzYtLjM2LDQuNTktMS4yNyw2LjU1LTIuNjksMi4wOS0xLjUxLDQuNjQtMS44NSw2LjQ4LS43OWw4LjMyLDQuOGMuNTYtMS40NCwxLjMyLTIuNzgsMi4yNy0zLjk3bC04LjI4LTQuNzhabS0xNy42MywzLjAzYy01LjgzLDAtMTAuNTctNC43NC0xMC41Ny0xMC41N3M0Ljc0LTEwLjU3LDEwLjU3LTEwLjU3LDEwLjU3LDQuNzQsMTAuNTcsMTAuNTctNC43NCwxMC41Ny0xMC41NywxMC41N1oiLz48cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik02OC4yMyw0Ny4xYy0xLjg0LDEuMDYtNC4zOSwuNzItNi40OC0uNzktMi41OS0xLjg4LTUuNjUtMi44Ny04Ljg0LTIuODctNC44LDAtOS4wOCwyLjI1LTExLjg1LDUuNzQtLjk1LDEuMTktMS43MiwyLjUzLTIuMjcsMy45Ny0uNjUsMS42OS0xLjAyLDMuNTItMS4wMiw1LjQzLDAsOC4zNSw2LjgsMTUuMTUsMTUuMTUsMTUuMTVzMTUuMTUtNi44LDE1LjE1LTE1LjE1YzAtLjQ4LS4wMi0uOTctLjA3LTEuNDQtLjItMi4xMiwuMzYtNC44MywyLjU1LTYuMDlsOC4xLTQuNjhjLS45Ni0xLjE4LTEuNzUtMi41MS0yLjMyLTMuOTVsLTguMDgsNC42N1ptLTE1LjMyLDIyLjA2Yy01LjgzLDAtMTAuNTctNC43NC0xMC41Ny0xMC41N3M0Ljc0LTEwLjU3LDEwLjU3LTEwLjU3LDEwLjU3LDQuNzUsMTAuNTcsMTAuNTctNC43NCwxMC41Ny0xMC41NywxMC41N1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03MC40LDIyLjY4Yy0yLjE4LTEuMjYtMi43NS0zLjk3LTIuNTQtNi4wOSwuMDQtLjQ4LC4wNy0uOTYsLjA3LTEuNDQsMC04LjM1LTYuOC0xNS4xNS0xNS4xNS0xNS4xNXMtMTUuMTUsNi44LTE1LjE1LDE1LjE1LDYuOCwxNS4xNSwxNS4xNSwxNS4xNWMzLjIsMCw2LjI1LS45OSw4Ljg0LTIuODcsMi4wOS0xLjUxLDQuNjMtMS44NSw2LjQ4LS43OWw4LjIsNC43M2MuNTYtMS40NCwxLjM0LTIuNzgsMi4yOS0zLjk3bC04LjE4LTQuNzNabS0xNy42MywzLjA0Yy01LjgzLDAtMTAuNTctNC43NC0xMC41Ny0xMC41N3M0Ljc0LTEwLjU3LDEwLjU3LTEwLjU3LDEwLjU3LDQuNzQsMTAuNTcsMTAuNTctNC43NCwxMC41Ny0xMC41NywxMC41N1oiLz48cGF0aCBjbGFzcz0iY2xzLTUiIGQ9Ik05Ni43Niw2Ni41OGMtMi41NS0xLjE4LTQuMDctMy4xNi00LjA3LTUuMjh2LTkuNDdjLS43NSwuMTEtMS41MSwuMTktMi4yOSwuMTlzLTEuNTQtLjA4LTIuMjktLjE5djkuNDdjMCwyLjEzLTEuNTIsNC4xLTQuMDcsNS4yOC01LjM0LDIuNDctOC43OSw3Ljg3LTguNzksMTMuNzMsMCwxLjk0LC4zOCwzLjc5LDEuMDUsNS41LC41NiwxLjQ0LDEuMzQsMi43OCwyLjI5LDMuOTcsMi43OCwzLjQ2LDcuMDQsNS42OSwxMS44MSw1LjY5LDguMzUsMCwxNS4xNS02LjgsMTUuMTUtMTUuMTYsMC01Ljg3LTMuNDUtMTEuMjYtOC43OS0xMy43M1ptLTYuMzYsMjQuMzFjLTUuODMsMC0xMC41Ny00Ljc0LTEwLjU3LTEwLjU3czQuNzQtMTAuNTcsMTAuNTctMTAuNTcsMTAuNTcsNC43NCwxMC41NywxMC41Ny00Ljc0LDEwLjU3LTEwLjU3LDEwLjU3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTkyLjY4LDUxLjgzYzcuMjctMS4xMSwxMi44Ni03LjM4LDEyLjg2LTE0Ljk2LDAtOC4zNi02Ljc5LTE1LjE1LTE1LjE1LTE1LjE1LTQuNzcsMC05LjAzLDIuMjMtMTEuODEsNS42OS0uOTUsMS4xOS0xLjczLDIuNTItMi4yOSwzLjk3LS42NywxLjcxLTEuMDUsMy41Ni0xLjA1LDUuNXMuMzgsMy44NCwxLjA3LDUuNTdjLjU3LDEuNDQsMS4zNiwyLjc2LDIuMzIsMy45NSwyLjMyLDIuODYsNS42Niw0Ljg2LDkuNDYsNS40NCwuNzUsLjExLDEuNTEsLjE5LDIuMjksLjE5czEuNTQtLjA4LDIuMjktLjE5Wm0tMTIuODYtMTQuOTZjMC01LjgzLDQuNzQtMTAuNTcsMTAuNTctMTAuNTdzMTAuNTcsNC43NCwxMC41NywxMC41Ny00Ljc0LDEwLjU3LTEwLjU3LDEwLjU3LTEwLjU3LTQuNzQtMTAuNTctMTAuNTdaIi8+PC9nPjxnPjxwYXRoIGNsYXNzPSJjbHMtOCIgZD0iTTE2My40Niw2OC42NmgtMjYuMjZWMTcuMjVoMjYuNTljLjc0LDAsMS40NSwuMDUsMi4xMSwuMTQsMi4zMiwuMzUsNC4xNywxLjEzLDUuNTMsMi4zMywxLjE3LDEuMDQsMS45OSwyLjU1LDIuNDUsNC41MSwuMjYsMS4xMywuNCwyLjQyLC40LDMuODR2MzAuMDVjMCwxLjE3LS4xLDIuMjMtLjI5LDMuMTUtLjQsMS44Ni0xLjEzLDMuMzgtMi4xOCw0LjUxLTEuMDcsMS4xNi0yLjU4LDEuOTgtNC41LDIuNDMtMS4yLC4yOS0yLjQ5LC40My0zLjg0LC40M1ptLTIxLjU1LTQuNjhoMjIuMjZjLjg1LDAsMS42NS0uMSwyLjM4LS4zMiwuNjQtLjE4LDEuMTgtLjUsMS42NC0uOTYsLjQ2LS40NiwuNzktMS4wNSwxLjAxLTEuNzksLjI0LS44MywuMzYtMS43OSwuMzYtMi44NlYyNy4zNWMwLS44Ny0uMDktMS42Mi0uMjgtMi4yMy0uMjMtLjc0LS41OS0xLjM2LTEuMDktMS44OS0uNC0uNDEtLjk3LS43My0xLjctLjk0LS44My0uMjQtMS43OC0uMzctMi44Mi0uMzdoLTIxLjc2VjYzLjk4WiIvPjxwYXRoIGNsYXNzPSJjbHMtOCIgZD0iTTIwOS44Nyw2OC42NmgtMTYuNTVjLS44NCwwLTEuOC0uMTgtMi44NS0uNTMtMS40Ny0uNDgtMi42OC0xLjItMy41OC0yLjE1LS44OC0uOTItMS41Ni0yLjAyLTIuMDMtMy4yNy0uNDYtMS4yNS0uNjktMi4zMi0uNjktMy4yOHYtNy4xMWMwLS45OSwuMjItMi4wOSwuNjYtMy4yOCwuNDUtMS4yMSwxLjEzLTIuMywyLjAyLTMuMjIsLjcxLS43MywxLjYyLTEuMzQsMi42OS0xLjgxLDEuMzctLjYsMi42NC0uOSwzLjc4LS45aDIxdi0zLjc1YzAtMS4yMi0uMDktMS44NC0uMTYtMi4xNS0uMTctLjc1LS41NS0xLjQzLTEuMTYtMi4wOS0uNDctLjU0LTEuMDItLjktMS43LTEuMTMtLjc1LS4yNS0xLjQ0LS4zOC0yLjA1LS4zOGgtMjUuMDh2LTQuNjhoMjUuNzFjLjg0LDAsMS44LC4xOCwyLjg1LC41MywxLjQ3LC40OCwyLjY3LDEuMiwzLjU4LDIuMTUsLjg4LC45MSwxLjU4LDIuMDUsMi4wOCwzLjM4LC40MywxLjE4LC42NSwyLjIsLjY1LDMuMTN2MjEuMzFjMCwxLjAxLS4yMSwyLjA3LS42MSwzLjE2LS40OCwxLjI5LTEuMTgsMi40MS0yLjA3LDMuMzItLjkxLC45NC0yLjExLDEuNjctMy41OCwyLjE3LTEuMTIsLjM4LTIuMDcsLjU3LTIuOSwuNTdabS0xNS45Mi0yMC44NmMtLjY1LDAtMS4yOSwuMS0xLjg5LC4zLS43NCwuMjYtMS4zNywuNjgtMS45LDEuMjctLjU0LC41OS0uODksMS4yNy0xLjA5LDIuMDctLjEzLC41NC0uMiwxLjI3LS4yLDIuMTZ2NC42M2MwLDEuMjMsLjA5LDEuODYsLjE2LDIuMTcsLjE3LC43NiwuNTUsMS40NCwxLjE2LDIuMTEsLjUsLjUzLDEuMTEsLjkyLDEuODgsMS4xOSwuNTgsLjIsMS4yMSwuMjksMS44NywuMjloMTUuMjljLjY2LDAsMS4yOS0uMSwxLjg5LS4zLC43NS0uMjYsMS4zNy0uNjcsMS45MS0xLjI1LC41My0uNTgsLjg4LTEuMjUsMS4wOC0yLjA0LC4xMy0uNTQsLjItMS4yNywuMi0yLjE3di0xMC40MmgtMjAuMzdaIi8+PHBhdGggY2xhc3M9ImNscy04IiBkPSJNMjc5LjM5LDY4LjY2aC0xNi41NWMtLjg0LDAtMS44LS4xOC0yLjg1LS41My0xLjQ3LS40OC0yLjY4LTEuMjEtMy41OC0yLjE1LS44OC0uOTItMS41Ni0yLjAyLTIuMDMtMy4yNy0uNDctMS4yNS0uNjktMi4zMi0uNjktMy4yOHYtNy4xMWMwLS45OSwuMjItMi4wOSwuNjYtMy4yOCwuNDQtMS4yMSwxLjEzLTIuMywyLjAyLTMuMjIsLjcxLS43MywxLjYyLTEuMzQsMi43LTEuODEsMS4zNi0uNiwyLjY0LS45LDMuNzgtLjloMjF2LTMuNzVjMC0xLjIyLS4wOS0xLjg0LS4xNi0yLjE1LS4xOC0uNzUtLjU1LTEuNDMtMS4xNi0yLjA5LS40Ny0uNTQtMS4wMi0uOS0xLjctMS4xMy0uNzUtLjI1LTEuNDQtLjM4LTIuMDUtLjM4aC0yNS4wOHYtNC42OGgyNS43MWMuODQsMCwxLjgsLjE4LDIuODUsLjUzLDEuNDcsLjQ4LDIuNjgsMS4yLDMuNTgsMi4xNSwuODcsLjkxLDEuNTgsMi4wNSwyLjA4LDMuMzgsLjQ0LDEuMTgsLjY0LDIuMiwuNjQsMy4xM3YyMS4zMWMwLDEuMDEtLjIxLDIuMDctLjYxLDMuMTYtLjQ4LDEuMjktMS4xOCwyLjQxLTIuMDcsMy4zMi0uOTEsLjkzLTIuMTEsMS42Ny0zLjU4LDIuMTctMS4xMiwuMzgtMi4wNywuNTctMi45LC41N1ptLTE1LjkyLTIwLjg2Yy0uNjYsMC0xLjI5LC4xLTEuODksLjMtLjc0LC4yNi0xLjM3LC42OC0xLjkxLDEuMjctLjU0LC41OS0uODksMS4yNy0xLjA5LDIuMDctLjEzLC41NC0uMiwxLjI3LS4yLDIuMTZ2NC42M2MwLDEuMjMsLjA5LDEuODYsLjE2LDIuMTcsLjE4LC43NiwuNTYsMS40NCwxLjE2LDIuMTEsLjUsLjUzLDEuMTEsLjkyLDEuODgsMS4xOSwuNTgsLjIsMS4yMiwuMjksMS44NywuMjloMTUuMjljLjY1LDAsMS4yOS0uMSwxLjg4LS4zLC43NS0uMjYsMS4zNy0uNjcsMS45Mi0xLjI1LC41My0uNTgsLjg4LTEuMjUsMS4wOC0yLjA0LC4xMy0uNTQsLjItMS4yNywuMi0yLjE3di0xMC40MmgtMjAuMzdaIi8+PHBhdGggY2xhc3M9ImNscy04IiBkPSJNMzI3LjE4LDY3Ljk2Yy0xLjIsMC0yLS40NS0yLjQ3LS44My0uNTMtLjQyLS45NS0uOTktMS4yNi0xLjY4bC0xNy43Ni0zMC45djM0LjExaC02Ljk3VjIxLjExYzAtLjk1LC4yNC0xLjc3LC43Mi0yLjQ1LC42NC0uOTEsMS42Ni0xLjQxLDIuODctMS40MSwuOTQsMCwxLjgzLC4zMiwyLjU3LC45MSwuNiwuNDgsMS4wOCwxLjEsMS40NiwxLjg2bDIwLjgsMzcuMDUsMjAuODMtMzcuMWMuMzMtLjY2LC44Mi0xLjI3LDEuNDMtMS43NywuNzctLjYyLDEuNjYtLjk1LDIuNTgtLjk1LDEuMTYsMCwyLjE2LC40OCwyLjgxLDEuMzYsLjUyLC42OCwuNzgsMS41MiwuNzgsMi41djQ3LjU1aC02Ljk3VjM0LjYxbC0xNy42NCwzMC44OWMtLjMsLjYxLS43MSwxLjE0LTEuMiwxLjU2LS40OCwuNDEtMS4zMiwuODktMi41NywuODlaIi8+PHBhdGggY2xhc3M9ImNscy04IiBkPSJNNDAzLjU5LDY4LjY2aC0yNy4yOWMtLjk4LDAtMi4wMy0uMTktMy4yMS0uNTktMS42NC0uNTMtMy4wMS0xLjM2LTQuMDUtMi40NS0xLjAxLTEuMDUtMS43Ni0yLjI3LTIuMjctMy42NC0uNDgtMS4zMi0uNzItMi41NS0uNzItMy42N3YtMTkuMDRjMC0xLjA5LC4yNC0yLjI3LC43Mi0zLjYyLC41LTEuMzgsMS4yNS0yLjYsMi4yMi0zLjY0LC44My0uODYsMS44Ni0xLjU2LDMuMDgtMi4wOCwxLjUzLS42NywyLjkxLS45OSw0LjIzLS45OWgxNy4wM2MuOTcsMCwyLjAyLC4xOSwzLjIxLC41OCwxLjY0LC41NCwzLDEuMzUsNC4wNSwyLjQyLDEuMDEsMS4wNCwxLjc5LDIuMzIsMi4zMywzLjgsLjQ0LDEuMjIsLjY3LDIuNCwuNjcsMy40OXY1LjQ5bC0zMC41NiwxMS41MXYuODFjMCwxLjA0LC4wOSwxLjYsLjE2LDEuOSwuMTUsLjU4LC40NSwxLjEyLC45MywxLjY2LC4zNSwuMzksLjc5LC42NywxLjMyLC44NSwuNDksLjE3LDEsLjI1LDEuNTYsLjI1aDI2LjZ2Ni45NFptLTI2LjYxLTMyLjc4Yy0uNTQsMC0xLjA0LC4wOC0xLjUzLC4yNC0uNTQsLjE5LS45OSwuNDgtMS4zNiwuODktLjQ3LC41MS0uNzcsMS4wNC0uOTEsMS42My0uMDYsLjI0LS4xNiwuNzgtLjE2LDEuODd2OC4zNGwyMy41OC04Ljg3Yy0uMDItLjY5LS4wOS0xLjExLS4xNS0xLjM1LS4xNC0uNTYtLjQ0LTEuMS0uOTItMS42My0uMzQtLjM3LS43My0uNjQtMS4yMS0uOC0uNi0uMjEtMS4xNy0uMzItMS42Ni0uMzJoLTE1LjY3WiIvPjxyZWN0IGNsYXNzPSJjbHMtOCIgeD0iNDEzLjciIHk9IjI4LjkiIHdpZHRoPSI2Ljk4IiBoZWlnaHQ9IjM5Ljc2Ii8+PHBhdGggY2xhc3M9ImNscy04IiBkPSJNNDU1Ljc5LDY4LjY2aC0yNS41NXYtNi45NGgyNS4yYy40OCwwLC45NS0uMDksMS40NS0uMjYsLjYtLjIyLDEuMS0uNTIsMS41Mi0uOTMsLjM2LS4zNSwuNjItLjgyLC43OS0xLjQzLC4xNC0uNDksLjIxLS45NSwuMjEtMS4zOHYtMS40YzAtLjY1LS4xMS0xLjIxLS4zMi0xLjc0LS4yLS41LS40NS0uODktLjcyLTEuMTUtLjE5LS4xOC0uNTctLjQ1LTEuMzMtLjcxLS44OS0uMzItMS4zOC0uMzctMS42LS4zN2gtMTQuOTJjLTEuMDgsMC0yLjI3LS4yNC0zLjUzLS43Mi0xLjQ4LS41Ni0yLjc0LTEuMzUtMy43NS0yLjM0LTEuMDItMS0xLjc4LTIuMTYtMi4yOC0zLjQ0LS40OC0xLjI0LS43Mi0yLjUzLS43Mi0zLjg0di0yLjc1YzAtMS4zMSwuMTktMi41MSwuNTctMy41NiwuNS0xLjM4LDEuMzItMi42MywyLjQ1LTMuNzEsMS4xMS0xLjA3LDIuNDctMS44OCw0LjA0LTIuNDEsMS4yMy0uNDIsMi4yOS0uNjIsMy4yMi0uNjJoMjUuODV2Ni45NGgtMjUuMjJjLS41MiwwLTEuMTgsLjExLTEuOTQsLjMzLS41LC4xNC0uODYsLjMzLTEuMDUsLjU2LS40NywuNTMtLjc1LDEuMDEtLjg1LDEuNDUtLjAzLC4xMS0uMSwuNTEtLjEsMS41N3YxLjY5YzAsLjc4LC4wOSwxLjI1LC4xNywxLjUxLC4xNSwuNSwuNDMsLjk2LC44NywxLjQsLjQzLC40NCwuODcsLjczLDEuMzQsLjg3LC4xOCwuMDYsLjQ5LC4xMiwxLjA0LC4xMmgxNS40OWMxLjIxLDAsMi40OSwuMjcsMy44MSwuODEsMS4zMywuNTQsMi41LDEuMywzLjQ3LDIuMjUsMSwuOTgsMS43NSwyLjE1LDIuMjUsMy40NiwuNDgsMS4yNywuNzIsMi41NiwuNzIsMy44M3YyLjU2YzAsMS4yMS0uMjQsMi40Ny0uNzEsMy43NC0uNDksMS4zMS0xLjI1LDIuNS0yLjI0LDMuNTQtMS4wNCwxLjA5LTIuNDEsMS45Mi00LjA3LDIuNDYtMS4yMywuNDEtMi40MywuNjItMy41NywuNjJaIi8+PHBhdGggY2xhc3M9ImNscy04IiBkPSJNNTM4LjM3LDY4LjY2aC0yNy4yOWMtLjk4LDAtMi4wMy0uMTktMy4yMS0uNTktMS42NC0uNTMtMy4wMS0xLjM2LTQuMDUtMi40Ni0xLTEuMDQtMS43Ni0yLjI3LTIuMjctMy42NC0uNDgtMS4zMi0uNzItMi41NS0uNzItMy42N3YtMTkuMDRjMC0xLjA5LC4yNC0yLjI3LC43Mi0zLjYyLC41LTEuMzgsMS4yNS0yLjYsMi4yMi0zLjY0LC44My0uODYsMS44Ny0xLjU2LDMuMDgtMi4wOCwxLjUyLS42NywyLjkxLS45OSw0LjIzLS45OWgxNy4wM2MuOTgsMCwyLjAzLC4xOSwzLjIxLC41OCwxLjY0LC41NCwzLDEuMzUsNC4wNCwyLjQyLDEuMDEsMS4wNCwxLjc5LDIuMzIsMi4zMywzLjgsLjQ0LDEuMjIsLjY4LDIuNCwuNjgsMy40OXY1LjQ5bC0zMC41NywxMS41MXYuODFjMCwxLjA0LC4wOSwxLjYsLjE2LDEuOSwuMTUsLjU4LC40NSwxLjEyLC45MywxLjY2LC4zNSwuMzksLjc5LC42NywxLjMyLC44NSwuNDksLjE3LDEsLjI1LDEuNTYsLjI1aDI2LjZ2Ni45NFptLTI2LjYxLTMyLjc4Yy0uNTQsMC0xLjAzLC4wOC0xLjUzLC4yNC0uNTQsLjE5LS45OSwuNDgtMS4zNiwuODktLjQ3LC41MS0uNzcsMS4wNC0uOTEsMS42My0uMDYsLjI0LS4xNiwuNzgtLjE2LDEuODd2OC4zNGwyMy41OC04Ljg3Yy0uMDItLjY5LS4wOS0xLjExLS4xNS0xLjM1LS4xNC0uNTYtLjQ0LTEuMS0uOTItMS42My0uMzQtLjM3LS43NC0uNjQtMS4yMS0uOC0uNjEtLjIxLTEuMTctLjMyLTEuNjctLjMyaC0xNS42N1oiLz48cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik01NTMuNzksNjguNjZoLTYuOTh2LTI5LjRjMC0xLjA5LC4yMy0yLjI3LC43Mi0zLjYyLC41LTEuMzgsMS4yNS0yLjYsMi4yMi0zLjY0LC44My0uODcsMS44Ny0xLjU2LDMuMDktMi4wOCwxLjUtLjY1LDIuOTMtLjk5LDQuMjMtLjk5aDkuODZ2Ni45NGgtOS4xOWMtLjk1LDAtMS40MSwuMDktMS42MSwuMTQtLjUyLC4xNS0uOTgsLjQ0LTEuNDEsLjg5LS40MywuNDUtLjcsLjk3LS44MiwxLjU4LS4wMywuMTMtLjExLC42My0uMTEsMi4wM3YyOC4xNFoiLz48cG9seWdvbiBjbGFzcz0iY2xzLTgiIHBvaW50cz0iMjQ0LjgzIDMzLjYyIDI0NC44MyAyOC45NCAyMzMuNiAyOC45NCAyMzMuNiAxOC4zOSAyMjguODkgMTguMzkgMjI4Ljg5IDY4LjY2IDIzMy42IDY4LjY2IDI0NC44MyA2OC42NiAyNDQuODMgNjMuOTggMjMzLjYgNjMuOTggMjMzLjYgMzMuNjIgMjQ0LjgzIDMzLjYyIi8+PHBvbHlnb24gY2xhc3M9ImNscy04IiBwb2ludHM9IjQ5MyAzNS44OCA0OTMgMjguOTQgNDgxLjc3IDI4Ljk0IDQ4MS43NyAxOC4zOSA0NzQuNzkgMTguMzkgNDc0Ljc5IDY4LjY2IDQ4MS43NyA2OC42NiA0OTMgNjguNjYgNDkzIDYxLjcyIDQ4MS43NyA2MS43MiA0ODEuNzcgMzUuODggNDkzIDM1Ljg4Ii8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSI0MTMuNyIgeT0iMTguMzkiIHdpZHRoPSI2Ljk4IiBoZWlnaHQ9IjYuOTgiLz48L2c+PGc+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMTQ0LjgzLDkxLjA2bC0uMi0uMDRjLTMuMTQtLjU4LTUuMi0xLjExLTUuMi0zLjAzLDAtMy4xOSw0LjU2LTMuMjgsNS4wNy0zLjI4LDEuOTUsLjAyLDMuOTIsLjMyLDUuMTQsMi4yNmwuMTksLjI5LDEuNzUtMS4wNC0uMjEtLjMxYy0xLjc4LTIuNjYtNC4wMy0zLjIxLTYuODYtMy4yMS0yLjQ2LDAtNC42NywuNzUtNS45MSwyLjAyLS44NywuODgtMS4yOSwyLTEuMjYsMy4zMiwwLDMuNjEsMy42OCw0LjMyLDYuOTIsNC45NiwzLjQsLjY1LDUuNjMsMS4yNSw1LjYxLDMuNDksMCwzLjEtMy43NSwzLjQ0LTUuMzYsMy40NC0yLjExLDAtNC43OS0xLjA1LTUuODEtMy4wNmwtLjE2LS4zMS0xLjg3LC45MywuMTcsLjMyYzEuNTIsMy4wMiw0Ljk2LDQuMDksNy42Nyw0LjA5LDEuNzUsMCw3LjQzLS4zOSw3LjQ2LTUuMzgsMC00LjA5LTMuNzktNC44Mi03LjE0LTUuNDZaIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMTc5LjAyLDk3LjY1Yy0xLjQxLDEuMzgtMy4zNiwyLjE4LTUuMzYsMi4xOC01LjQ5LDAtNy41LTQuMDMtNy41NC03LjQ5LS4wMS0yLjIzLC43My00LjIyLDIuMDktNS41OSwxLjMzLTEuMzQsMy4yMS0yLjA1LDUuNDQtMi4wNSwyLjAzLDAsMy45MywuNzcsNS4zMywyLjE3bC4yNCwuMjMsMS40OS0xLjI5LS4yOC0uMjdjLTEuOC0xLjgtNC4yMS0yLjc5LTYuNzgtMi43OS0yLjgxLDAtNS4yLC45Mi02LjkyLDIuNjYtMS43NSwxLjc2LTIuNjksNC4yNC0yLjY2LDYuOTgsLjAyLDQuNjksMyw5LjQyLDkuNTgsOS40MiwyLjUzLDAsNS4wMS0xLjAyLDYuNzgtMi44bC4yNi0uMjYtMS40NC0xLjM2LS4yNCwuMjRaIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMjAxLjQyLDgyLjk3aC0xLjk3bC04LjM3LDE4LjY1aDIuMjdsMS45NS00LjQxaDEwLjI1bDEuOTgsNC40MWgyLjI3bC04LjM3LTE4LjY1Wm0zLjI3LDEyLjI1aC04LjU0bDQuMjctOS42OCw0LjI3LDkuNjhaIi8+PHBvbHlnb24gY2xhc3M9ImNscy03IiBwb2ludHM9IjIyNC4zOCA5OS42IDIyNC4zOCA4Mi45NyAyMjIuMjkgODIuOTcgMjIyLjI5IDEwMS42MiAyMzQuNDggMTAxLjYyIDIzNC40OCA5OS42IDIyNC4zOCA5OS42Ii8+PHBvbHlnb24gY2xhc3M9ImNscy03IiBwb2ludHM9IjI3Ni4wOCA4Mi45NyAyNzYuMDggOTcuMTYgMjY0LjU0IDgyLjk3IDI2My40MiA4Mi45NyAyNjMuNDIgMTAxLjYyIDI2NS41MiAxMDEuNjIgMjY1LjUyIDg3LjQ1IDI3Ni45OCAxMDEuNDkgMjc3LjA5IDEwMS42MiAyNzguMTUgMTAxLjYyIDI3OC4xNSA4Mi45NyAyNzYuMDggODIuOTciLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik0yOTkuODQsOTEuNTN2MS45MWg2LjI1djQuNTFjLTEuMzgsMS4yMS0zLjE5LDEuODgtNS4xLDEuODgtNS4yMiwwLTcuNTYtMy43Ny03LjU2LTcuNTEtLjAyLTIuMiwuNzQtNC4xNywyLjEyLTUuNTcsMS4zNS0xLjM1LDMuMjMtMi4wNyw1LjQ0LTIuMDcsMi4wNSwwLDQuMTEsLjgyLDUuNTIsMi4ybC4yNiwuMjYsMS4yNy0xLjM5LS4yNC0uMjRjLTEuODMtMS44LTQuMjQtMi43OS02LjgxLTIuNzktMi44MiwwLTUuMjMsLjkzLTYuOTgsMi42OC0xLjczLDEuNzQtMi42NSw0LjE1LTIuNjMsNi45NSwwLDQuNzMsMi45Nyw5LjUxLDkuNjEsOS41MSwyLjY2LDAsNS4wMi0xLjAxLDcuMDItM2wuMS0uMXYtNy4yMmgtOC4yN1oiLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik0zNDMuNDMsODIuOTdoLTEuOTdsLTguMzcsMTguNjVoMi4yN2wxLjk0LTQuNDFoMTAuMjVsMS45Nyw0LjQxaDIuMjdsLTguMzctMTguNjVabTMuMjcsMTIuMjVoLTguNTRsNC4yOC05LjY4LDQuMjcsOS42OFoiLz48cG9seWdvbiBjbGFzcz0iY2xzLTciIHBvaW50cz0iMzc2LjcyIDgyLjk3IDM3Ni43MiA5Ny4xNiAzNjUuMTggODIuOTcgMzY0LjA3IDgyLjk3IDM2NC4wNyAxMDEuNjIgMzY2LjE2IDEwMS42MiAzNjYuMTYgODcuNDUgMzc3LjYzIDEwMS40OSAzNzcuNzMgMTAxLjYyIDM3OC44IDEwMS42MiAzNzguOCA4Mi45NyAzNzYuNzIgODIuOTciLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik00MDEuMjMsODIuOTdoLTEuOThsLTguMzYsMTguNjVoMi4yN2wxLjk1LTQuNDFoMTAuMjVsMS45Nyw0LjQxaDIuMjdsLTguMzYtMTguNjVabTMuMjcsMTIuMjVoLTguNTRsNC4yNy05LjY4LDQuMjcsOS42OFoiLz48cG9seWdvbiBjbGFzcz0iY2xzLTciIHBvaW50cz0iNDI0LjE5IDk5LjYgNDI0LjE5IDgyLjk3IDQyMi4xIDgyLjk3IDQyMi4xIDEwMS42MiA0MzQuMjkgMTAxLjYyIDQzNC4yOSA5OS42IDQyNC4xOSA5OS42Ii8+PHBvbHlnb24gY2xhc3M9ImNscy03IiBwb2ludHM9IjQ1Ni4yNCA4Mi45NyA0NTAuMzQgOTIuMSA0NDQuNTYgODMuMTMgNDQ0LjQ2IDgyLjk3IDQ0Mi42NSA4Mi45NyA0NDIuMjkgODIuOTkgNDQyLjI5IDgzLjQ2IDQ0OS4yOSA5NC4xOSA0NDkuMjkgMTAxLjYyIDQ1MS4zOSAxMDEuNjIgNDUxLjM5IDk0LjE5IDQ1OC4zNSA4My41NCA0NTguNDEgODMuNDMgNDU4LjQxIDgyLjk3IDQ1Ni4yNCA4Mi45NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtNyIgcG9pbnRzPSI0NjkuNjcgODIuOTkgNDY5LjY3IDg0Ljk0IDQ3Ni4xNSA4NC45NCA0NzYuMTUgMTAxLjYyIDQ3OC4yNSAxMDEuNjIgNDc4LjI1IDg0Ljk0IDQ4NC43MyA4NC45NCA0ODQuNzMgODIuOTkgNDY5LjY3IDgyLjk5Ii8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNNTI3LjY1LDk3LjY1Yy0xLjQxLDEuMzgtMy4zNiwyLjE4LTUuMzYsMi4xOC01LjQ5LDAtNy40OS00LjAzLTcuNTQtNy40OSwwLTIuMjMsLjczLTQuMjIsMi4wOS01LjU5LDEuMzMtMS4zNCwzLjIxLTIuMDUsNS40NC0yLjA1LDIuMDMsMCwzLjkzLC43Nyw1LjM0LDIuMTdsLjI0LC4yMywxLjQ5LTEuMjktLjI3LS4yN2MtMS44LTEuOC00LjIxLTIuNzktNi43OS0yLjc5LTIuODEsMC01LjIsLjkyLTYuOTIsMi42Ni0xLjc1LDEuNzctMi42OSw0LjI0LTIuNjYsNi45OCwuMDIsNC42OSwyLjk5LDkuNDIsOS41OCw5LjQyLDIuNTQsMCw1LjAxLTEuMDIsNi43OS0yLjhsLjI2LS4yNi0xLjQ0LTEuMzYtLjI0LC4yNFoiLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik01NDkuNjksOTEuMDZsLS4yLS4wNGMtMy4xNC0uNTgtNS4yLTEuMTEtNS4yLTMuMDMsMC0zLjE5LDQuNTYtMy4yOCw1LjA3LTMuMjgsMS45NSwuMDIsMy45MiwuMzIsNS4xMywyLjI2bC4xOSwuMjksMS43NS0xLjA0LS4yMS0uMzFjLTEuNzgtMi42Ni00LjAzLTMuMjEtNi44Ni0zLjIxLTIuNDYsMC00LjY3LC43NS01LjkxLDIuMDItLjg3LC44OC0xLjI5LDItMS4yNiwzLjMyLDAsMy42MSwzLjY4LDQuMzIsNi45Myw0Ljk2LDMuNCwuNjUsNS42MiwxLjI1LDUuNiwzLjQ5LDAsMy4xLTMuNzUsMy40NC01LjM2LDMuNDQtMi4xMiwwLTQuNzktMS4wNS01LjgxLTMuMDZsLS4xNi0uMzEtMS44NywuOTMsLjE2LC4zMmMxLjUyLDMuMDIsNC45Niw0LjA5LDcuNjcsNC4wOSwxLjc0LDAsNy40Mi0uMzksNy40Ni01LjM4LDAtNC4wOS0zLjgtNC44Mi03LjE0LTUuNDZaIi8+PHBvbHlnb24gY2xhc3M9ImNscy03IiBwb2ludHM9IjUwMi40IDg0Ljc3IDUwMi40IDgyLjk3IDQ5NC42OCA4Mi45NyA0OTQuNjggODQuNzcgNDk3LjUxIDg0Ljc3IDQ5Ny41MSA5OS44MiA0OTQuNjggOTkuODIgNDk0LjY4IDEwMS42MiA1MDIuNCAxMDEuNjIgNTAyLjQgOTkuODIgNDk5LjU4IDk5LjgyIDQ5OS41OCA4NC43NyA1MDIuNCA4NC43NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtNyIgcG9pbnRzPSIyNTIuMTUgODQuNzcgMjUyLjE1IDgyLjk3IDI0NC40MiA4Mi45NyAyNDQuNDIgODQuNzcgMjQ3LjI1IDg0Ljc3IDI0Ny4yNSA5OS44MiAyNDQuNDIgOTkuODIgMjQ0LjQyIDEwMS42MiAyNTIuMTUgMTAxLjYyIDI1Mi4xNSA5OS44MiAyNDkuMzIgOTkuODIgMjQ5LjMyIDg0Ljc3IDI1Mi4xNSA4NC43NyIvPjwvZz48L2c+PC9nPjwvc3ZnPg==";

function getAiOrdered(L){const imgs=L.images;if(L.aiOrder&&Array.isArray(L.aiOrder))return L.aiOrder.map(i=>imgs[i]).filter(Boolean);return[...imgs]}
function Stars({n}){if(!n)return null;const c=["#ddd","#e24b4a","#ef9f27","#BA7517","#639922","#0d7a50"];return <span style={{fontSize:11,letterSpacing:1,color:c[n]||"#ddd"}}>{Array.from({length:5},(_,i)=>i<n?"★":"☆").join("")}</span>}
function useIsMobile(){const[m,setM]=useState(false);useEffect(()=>{const c=()=>setM(window.innerWidth<768);c();window.addEventListener("resize",c);return()=>window.removeEventListener("resize",c)},[]);return m}

// Combined photo viewer + rank picker modal
function PhotoModal({images,startIdx,onClose,onRankMove,onRemove}){
  const[idx,setIdx]=useState(startIdx||0);
  const[confirmRemove,setConfirmRemove]=useState(false);
  const ts=useRef(null);
  const img=images[idx];const ai=img?.ai;
  const cols=Math.min(5,images.length);
  const prev=()=>setIdx(i=>i>0?i-1:images.length-1);
  const next=()=>setIdx(i=>i<images.length-1?i+1:0);
  useEffect(()=>{const h=e=>{if(e.key==="ArrowLeft")prev();else if(e.key==="ArrowRight")next();else if(e.key==="Escape")onClose()};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[idx]);
  const desc=ai?.description||ai?.desc||"";
  const aiSees=ai?.ai_sees||"";
  const displayDesc=desc||(aiSees&&aiSees!=="Awaiting AI vision analysis."?aiSees:"");
  const pending=ai?.room_en==="(pending)";

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.94)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:8}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:480,maxHeight:"95vh",overflowY:"auto",position:"relative"}}>
        {/* Photo area */}
        <div style={{position:"relative",background:"#111",borderRadius:"16px 16px 0 0",overflow:"hidden"}}
          onTouchStart={e=>{ts.current=e.touches[0].clientX}}
          onTouchEnd={e=>{if(ts.current===null)return;const d=e.changedTouches[0].clientX-ts.current;if(Math.abs(d)>50){d>0?prev():next()}ts.current=null}}>
          <img src={img.src} alt="" style={{width:"100%",maxHeight:"40vh",objectFit:"contain",display:"block"}}/>
          <button onClick={prev} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",fontSize:22,width:34,height:34,borderRadius:17,cursor:"pointer"}}>‹</button>
          <button onClick={next} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",fontSize:22,width:34,height:34,borderRadius:17,cursor:"pointer"}}>›</button>
          <div style={{position:"absolute",top:10,right:10}}><button onClick={onClose} style={{background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",fontSize:16,width:30,height:30,borderRadius:15,cursor:"pointer"}}>✕</button></div>
          <div style={{position:"absolute",bottom:8,left:0,right:0,textAlign:"center",color:"#fff",fontSize:12,textShadow:"0 1px 3px rgba(0,0,0,0.8)"}}>{idx+1} / {images.length}</div>
        </div>

        {/* Info */}
        <div style={{padding:"14px 16px 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:16,fontWeight:700,color:"#222"}}>{pending?"Photo "+(idx+1):(ai?.room_en||"Photo")}</span>
            {ai?.room_jp&&!pending&&<span style={{fontSize:13,color:"#999"}}>{ai.room_jp}</span>}
            {ai?.stars>0&&<Stars n={ai.stars}/>}
          </div>
          {displayDesc&&!pending&&<div style={{fontSize:13,color:"#555",lineHeight:1.6,marginBottom:8}}>{displayDesc}</div>}
          {ai?.brightness>0&&<div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:11,color:"#aaa",marginBottom:8}}>
            <span>Brightness {ai.brightness}/5</span><span>Composition {ai.composition}/5</span><span>Space {ai.spaciousness}/5</span><span>Clutter {ai.clutter}/5</span>
          </div>}
        </div>

        {/* Rank picker */}
        <div style={{padding:"0 16px 12px"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"#aaa",marginBottom:8}}>Set rank position</div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${cols}, 1fr)`,gap:5}}>
            {images.map((_,ti)=>{const isCur=ti===idx;const t=images[ti];return(
              <button key={ti} onClick={()=>{if(!isCur){onRankMove(idx,ti)}}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px 2px",borderRadius:7,cursor:isCur?"default":"pointer",border:isCur?"2px solid #0097cc":"1px solid #e5e5e5",background:isCur?"#eef8fc":"#fff",opacity:isCur?.5:1}}>
                <div style={{width:36,height:24,borderRadius:3,overflow:"hidden",background:"#f0f0f0"}}><img src={t.src} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/></div>
                <div style={{fontSize:12,fontWeight:700,color:isCur?"#0097cc":"#555"}}>{ti+1}</div>
              </button>
            )})}
          </div>
        </div>

        {/* Remove */}
        <div style={{padding:"0 16px 16px",borderTop:"1px solid #f0f0f0",paddingTop:12}}>
          {!confirmRemove?
            <button onClick={()=>setConfirmRemove(true)} style={{fontSize:12,color:"#dc3545",background:"none",border:"1px solid #fecaca",borderRadius:6,padding:"6px 14px",cursor:"pointer",width:"100%"}}>Remove this photo from listing</button>
          :<div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:12,color:"#dc3545",flex:1}}>Remove this photo?</span>
            <button onClick={()=>{onRemove(idx);if(idx>=images.length-1)setIdx(Math.max(0,idx-1));setConfirmRemove(false)}} style={{fontSize:12,color:"#fff",background:"#dc3545",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer"}}>Yes, remove</button>
            <button onClick={()=>setConfirmRemove(false)} style={{fontSize:12,color:"#666",background:"#f0f0f0",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer"}}>Cancel</button>
          </div>}
        </div>

        {/* Filmstrip */}
        <div style={{display:"flex",gap:4,overflowX:"auto",padding:"0 16px 16px"}}>
          {images.map((m,i)=>(<div key={i} onClick={()=>setIdx(i)} style={{width:40,height:28,borderRadius:3,overflow:"hidden",border:i===idx?"2px solid #0097cc":"2px solid transparent",cursor:"pointer",flexShrink:0,opacity:i===idx?1:0.4}}><img src={m.src} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>))}
        </div>
      </div>
    </div>
  );
}

function ListingSelector({listings,sel,onSelect,okMap}){
  const[open,setOpen]=useState(false);const ref=useRef(null);
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);document.addEventListener("touchstart",h);return()=>{document.removeEventListener("mousedown",h);document.removeEventListener("touchstart",h)}},[]);
  const prev=()=>onSelect(sel>0?sel-1:listings.length-1);const next=()=>onSelect(sel<listings.length-1?sel+1:0);const L=listings[sel];
  return(
    <div ref={ref} style={{position:"relative",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:0,background:"#fff",border:"1px solid #e5e7ea",borderRadius:10}}>
        <button onClick={prev} style={{fontSize:20,color:"#0097cc",background:"none",border:"none",cursor:"pointer",padding:"10px 14px",lineHeight:1,flexShrink:0}}>‹</button>
        <div onClick={()=>setOpen(!open)} style={{flex:1,cursor:"pointer",display:"flex",alignItems:"center",gap:8,minWidth:0,padding:"8px 0"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{L.title} {okMap[sel]&&<span style={{color:"#0d7a50"}}>✓</span>}</div>
            <div style={{fontSize:11,color:"#999"}}>{L.area} · {L.rent}/mo · {L.beds} · {sel+1} of {listings.length}</div>
          </div>
          <span style={{fontSize:12,color:"#999",flexShrink:0,paddingRight:8}}>{open?"▲":"▼"}</span>
        </div>
        <button onClick={next} style={{fontSize:20,color:"#0097cc",background:"none",border:"none",cursor:"pointer",padding:"10px 14px",lineHeight:1,flexShrink:0}}>›</button>
      </div>
      {open&&(<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e5e7ea",borderRadius:10,marginTop:4,zIndex:50,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",maxHeight:300,overflowY:"auto"}}>
        {listings.map((l,i)=>(<div key={i} onClick={()=>{onSelect(i);setOpen(false)}} style={{padding:"10px 14px",cursor:"pointer",borderBottom:i<listings.length-1?"1px solid #f0f0f0":"none",background:i===sel?"#eef8fc":"#fff"}}>
          <div style={{fontSize:13,fontWeight:i===sel?700:500,color:i===sel?"#0097cc":"#333"}}>{l.title} {okMap[i]&&<span style={{color:"#0d7a50"}}>✓</span>}</div>
          <div style={{fontSize:11,color:"#999"}}>{l.area} · {l.rent}/mo · {l.beds} · {l.sqm} m²</div>
        </div>))}
      </div>)}
    </div>
  );
}

export default function App(){
  const[sel,setSel]=useState(0);const[aiImgs,setAiImgs]=useState(null);const[ok,setOk]=useState({});
  const[modalIdx,setModalIdx]=useState(null);
  const isMobile=useIsMobile();

  const L=LISTINGS[sel];const orig=L.images;const aiOrdered=getAiOrdered(L);
  const activeDefault=aiOrdered.filter(p=>!p.ai?.remove);const removedDefault=aiOrdered.filter(p=>p.ai?.remove);
  const defaultList=[...activeDefault,...removedDefault.map(p=>({...p,removed:true}))];
  const oMap={};orig.forEach((m,i)=>{oMap[m.src]=i+1});
  const cur=aiImgs||defaultList;const active=cur.filter(p=>!p.removed);const removed=cur.filter(p=>p.removed);

  useEffect(()=>{setAiImgs(null);setModalIdx(null)},[sel]);

  const handleRankMove=(from,to)=>{const a=[...active];const r=[...removed];const[item]=a.splice(from,1);a.splice(to,0,item);setAiImgs([...a,...r])};
  const handleRemove=(idx)=>{const img=active[idx];if(!img)return;const c=[...(aiImgs||defaultList)];const i=c.findIndex(p=>p.src===img.src);if(i>=0){c[i]={...c[i],removed:true};setAiImgs(c)}setModalIdx(null)};
  const handleRestore=(img)=>{const c=[...(aiImgs||defaultList)];const i=c.findIndex(p=>p.src===img.src);if(i>=0){c[i]={...c[i],removed:false};setAiImgs(c)}};

  // Desktop drag
  const di=useRef(null),dov=useRef(null);const[dIdx,setDIdx]=useState(null),[oIdx,setOIdx]=useState(null);
  const ds=i=>{di.current=i;setDIdx(i)};const de=i=>{dov.current=i;setOIdx(i)};
  const dd=()=>{if(di.current!==null&&dov.current!==null&&di.current!==dov.current){handleRankMove(di.current,dov.current)}di.current=null;dov.current=null;setDIdx(null);setOIdx(null)};

  const isPending=active[0]?.ai?.room_en==="(pending)";
  const reasons=[];
  if(!isPending){
    if(active.length>0&&orig[0]?.src!==active[0]?.src){const h=active[0]?.ai;reasons.push(`Hero: "${h?.room_en||"photo"}" selected${h?.stars?` — quality ${h.stars}★.`:"."}`);}
    if(removed.length>0)reasons.push(`${removed.length} photo${removed.length>1?"s":""} flagged for removal.`);
    const mvd=active.filter((m,i)=>oMap[m.src]!==(i+1)).length;
    if(mvd>0)reasons.push(`${mvd} of ${orig.length} photos repositioned for optimal flow.`);
  }

  const imgSize=isMobile?{w:120,h:80,hw:160,hh:108}:{w:96,h:64,hw:140,hh:94};

  return(
    <div style={{minHeight:"100vh",background:"#f5f6f8",color:"#222",fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7ea",padding:isMobile?"8px 12px":"10px 20px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100,flexWrap:"wrap"}}>
        <img src={`data:image/svg+xml;base64,${DM_LOGO}`} alt="DataMeister" style={{height:isMobile?22:28}}/>
        <div style={{width:1,height:isMobile?20:24,background:"#e0e0e0"}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:isMobile?13:15,fontWeight:700,color:"#222",whiteSpace:"nowrap"}}>Photo Sorting Agent <span style={{fontSize:isMobile?10:11,color:"#999",fontWeight:400}}>for <span style={{color:"#0097cc",fontWeight:600}}>apts.jp</span></span></div>
        </div>
        <span style={{fontSize:8,fontWeight:600,letterSpacing:"0.06em",color:"#0097cc",background:"#eef8fc",padding:"2px 6px",borderRadius:3}}>PROTOTYPE</span>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"12px 12px 40px"}}>
        <ListingSelector listings={LISTINGS} sel={sel} onSelect={setSel} okMap={ok}/>

        {/* Listing card */}
        <div style={{background:"#fff",border:"1px solid #e5e7ea",borderRadius:10,padding:"12px 14px",marginBottom:10,position:"relative"}}>
          <a href={L.url} target="_blank" rel="noopener noreferrer" style={{position:"absolute",top:12,right:14,fontSize:11,fontWeight:600,color:"#fff",background:"#0097cc",padding:"5px 12px",borderRadius:6,textDecoration:"none"}}>apts.jp ↗</a>
          <div style={{fontSize:16,fontWeight:700,marginBottom:4,paddingRight:100}}>{L.title}</div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:12,color:"#555"}}><span><b style={{fontSize:14}}>{L.rent}</b>/mo</span><span>{L.beds} · {L.sqm}m²</span><span>{L.station} · {L.walk}</span></div>
          <div style={{fontSize:11,color:"#999",marginTop:3}}>{L.address}, Tokyo · Built {L.built}</div>
        </div>

        {/* Filmstrip */}
        <div style={{background:"#fff",border:"1px solid #e5e7ea",borderRadius:10,padding:"8px 12px",marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"#aaa",marginBottom:6}}>Current order on apts.jp</div>
          <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:3}}>
            {orig.map((img,i)=>{const ai=img.ai;const label=ai?.room_en&&ai.room_en!=="(pending)"?ai.room_en:`#${i+1}`;return(
              <div key={i} style={{flexShrink:0,textAlign:"center",cursor:"pointer"}} onClick={()=>setModalIdx(i)}>
                <div style={{position:"relative",width:isMobile?72:60,height:isMobile?50:42,borderRadius:4,overflow:"hidden",border:"1px solid #ddd",background:"#eee"}}>
                  <img src={img.src} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/>
                  {i===0&&<span style={{position:"absolute",top:1,left:1,fontSize:6,background:"#e24b4a",color:"#fff",padding:"0 3px",borderRadius:2}}>HERO</span>}
                </div>
                <div style={{fontSize:7,color:"#888",marginTop:1,maxWidth:isMobile?72:60,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>#{i+1} {label}</div>
              </div>
            )})}
          </div>
        </div>

        {/* AI summary */}
        <div style={{background:"#fff",border:"1px solid #e5e7ea",borderRadius:10,padding:"10px 14px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:reasons.length?6:0}}>
            <span style={{width:18,height:18,borderRadius:5,background:"#0097cc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff"}}>⚡</span>
            <span style={{fontSize:12,fontWeight:700}}>AI Vision Analysis</span>
            <span style={{fontSize:10,color:"#aaa"}}>{orig.length} photos</span>
            {isPending?<span style={{fontSize:10,color:"#ef9f27",fontWeight:500}}>⏳</span>:<span style={{fontSize:10,color:"#0d7a50",fontWeight:500}}>✓</span>}
          </div>
          {reasons.map((r,i)=>(<div key={i} style={{fontSize:11,color:"#666",lineHeight:1.5,paddingLeft:8,borderLeft:"2px solid #0097cc",marginBottom:2}}>{r}</div>))}
        </div>

        {/* AI cards */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"#0097cc"}}>⚡ AI recommended order</span>
          <span style={{flex:1}}/><span style={{fontSize:9,color:"#999"}}>{isMobile?"Tap to edit":"Drag or click to edit"}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {active.map((img,idx)=>{
            const ai=img.ai;const origPos=oMap[img.src];const delta=origPos?(origPos-(idx+1)):0;
            const hero=idx===0;const moved=delta!==0;const isDrag=dIdx===idx;const isOver=oIdx===idx&&dIdx!==idx;
            const pending=ai?.room_en==="(pending)";
            const desc=ai?.description||ai?.desc||"";
            const aiSees=ai?.ai_sees||"";
            const displayDesc=desc||(aiSees&&aiSees!=="Awaiting AI vision analysis."?aiSees:"");
            const dragProps=isMobile?{}:{draggable:true,onDragStart:()=>ds(idx),onDragEnter:()=>de(idx),onDragEnd:dd,onDragOver:e=>e.preventDefault()};

            return(
              <div key={img.src+idx} {...dragProps} onClick={()=>setModalIdx(idx)}
                style={{background:isDrag?"#e3f6fc":isOver?"#f0f9ff":hero?"#f0fbff":"#fff",
                  border:isOver?"1.5px dashed #0097cc":hero?"1.5px solid #b3e5f7":"1px solid #e8eaed",
                  borderRadius:10,padding:"8px 10px",opacity:isDrag?.4:1,cursor:isMobile?"pointer":"grab",transition:"all 0.1s"}}>
                {/* Row 1: rank + photo + position indicator */}
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:displayDesc&&!pending?6:0}}>
                  <span style={{width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:hero?"#0097cc":"#f0f0f0",color:hero?"#fff":"#999",flexShrink:0}}>{idx+1}</span>
                  <div style={{width:hero?imgSize.hw:imgSize.w,height:hero?imgSize.hh:imgSize.h,borderRadius:6,overflow:"hidden",border:hero?"2px solid #0097cc":"1px solid #e5e5e5",flexShrink:0,background:"#f8f8f8",position:"relative"}}>
                    <img src={img.src} style={{width:"100%",height:"100%",objectFit:"contain"}} loading="lazy"/>
                    {hero&&<span style={{position:"absolute",top:2,left:2,fontSize:6,fontWeight:700,color:"#fff",background:"#0097cc",borderRadius:2,padding:"1px 4px"}}>HERO</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:600,color:pending?"#bbb":"#222"}}>{pending?"Photo "+(idx+1):(ai?.room_en||"Photo")}</span>
                      {ai?.room_jp&&!pending&&<span style={{fontSize:10,color:"#aaa"}}>{ai.room_jp}</span>}
                      {ai?.stars>0&&<Stars n={ai.stars}/>}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0,gap:2}}>
                    {origPos&&moved&&<span style={{fontSize:10,fontWeight:600,color:"#999"}}>#{origPos}</span>}
                    {moved&&<span style={{fontSize:8,fontWeight:700,color:delta>0?"#0d7a50":"#dc3545",background:delta>0?"#e8faf3":"#fde8e8",borderRadius:3,padding:"0 4px"}}>{delta>0?`↑${delta}`:`↓${Math.abs(delta)}`}</span>}
                  </div>
                </div>
                {/* Row 2: text */}
                {displayDesc&&!pending&&<div style={{fontSize:12,color:"#555",lineHeight:1.5,paddingLeft:32}}>{displayDesc}</div>}
                {pending&&<div style={{fontSize:11,color:"#ccc",fontStyle:"italic",paddingLeft:32}}>Awaiting AI analysis...</div>}
              </div>
            );
          })}
        </div>

        {/* Removed */}
        {removed.length>0&&<>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"#dc3545",marginTop:14,marginBottom:6}}>Removed ({removed.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {removed.map(img=>{const ai=img.ai;const origPos=oMap[img.src];return(
              <div key={img.src} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"8px 10px",opacity:.6}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{width:22,height:22,borderRadius:5,background:"#fef2f2",border:"1px solid #fecaca",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:"#dc3545",flexShrink:0}}>—</span>
                  <div style={{width:56,height:38,borderRadius:5,overflow:"hidden",border:"1px solid #eee",flexShrink:0}}><img src={img.src} style={{width:"100%",height:"100%",objectFit:"contain",opacity:.5}} loading="lazy"/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#999",textDecoration:"line-through"}}>{ai?.room_en||"Photo"} {ai?.stars>0&&<Stars n={ai.stars}/>}</div>
                    <div style={{fontSize:10,color:"#dc3545",marginTop:1}}>{ai?.remove_reason||"Removed"}</div>
                  </div>
                  <button onClick={()=>handleRestore(img)} style={{fontSize:9,color:"#0097cc",background:"none",border:"1px solid #b3d9f2",borderRadius:4,padding:"3px 8px",cursor:"pointer",flexShrink:0}}>Restore</button>
                </div>
              </div>)})}
          </div></>}

        {/* Actions */}
        <div style={{display:"flex",gap:8,marginTop:12,justifyContent:"flex-end"}}>
          {aiImgs&&<button onClick={()=>setAiImgs(null)} style={{padding:"7px 14px",borderRadius:7,border:"1px solid #ddd",background:"#fff",color:"#666",fontSize:11,fontWeight:600,cursor:"pointer"}}>Reset</button>}
          <button onClick={()=>setOk(p=>({...p,[sel]:true}))} style={{padding:"7px 20px",borderRadius:7,border:"none",background:ok[sel]?"#0d7a50":"#0097cc",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>{ok[sel]?"✓ Approved":"Approve order"}</button>
        </div>

        <div style={{marginTop:12,padding:"8px 12px",background:"#fff",borderRadius:7,border:"1px solid #e5e7ea",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10,color:"#aaa"}}>
          <span>{Object.keys(ok).length}/{LISTINGS.length}</span>
          <div style={{display:"flex",gap:3}}>{LISTINGS.map((_,i)=>(<div key={i} style={{width:7,height:7,borderRadius:"50%",background:ok[i]?"#0d7a50":"#e0e0e0"}}/>))}</div>
          <span>~{Object.keys(ok).length*25}min saved</span>
        </div>

        <div style={{textAlign:"center",marginTop:20,fontSize:10,color:"#ccc"}}>
          <img src={`data:image/svg+xml;base64,${DM_LOGO}`} alt="DataMeister" style={{height:12,verticalAlign:"middle",opacity:.4}}/> · <a href="https://datameister.co.jp" target="_blank" rel="noopener noreferrer" style={{color:"#aaa",textDecoration:"none"}}>datameister.co.jp</a>
        </div>
      </div>
      {modalIdx!==null&&<PhotoModal images={active} startIdx={modalIdx} onClose={()=>setModalIdx(null)} onRankMove={handleRankMove} onRemove={handleRemove}/>}
    </div>
  );
}
